from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import ScenarioAttempt, UserProgress
from app.schemas import (
    Scenario,
    ScenarioSubmitRequest,
    ScenarioSubmitResponse,
    LessonModule,
    QuizSubmitRequest,
    QuizSubmitResponse,
    ProgressResponse
)
from app.data.scenarios import SCENARIOS
from app.data.lessons import LESSONS

router = APIRouter(prefix="/api/training", tags=["Training & Simulator"])

@router.get("/scenarios", response_model=List[Scenario])
def get_scenarios():
    return SCENARIOS

@router.post("/submit-answer", response_model=ScenarioSubmitResponse)
def submit_scenario_answer(req: ScenarioSubmitRequest, db: Session = Depends(get_db)):
    # Find scenario
    target_scenario = next((s for s in SCENARIOS if s["id"] == req.scenario_id), None)
    if not target_scenario:
        raise HTTPException(status_code=404, detail="Scenario not found.")

    chosen_opt = next((o for o in target_scenario["options"] if o["id"] == req.chosen_option_id), None)
    if not chosen_opt:
        raise HTTPException(status_code=400, detail="Invalid option ID for this scenario.")

    safest_opt = next((o for o in target_scenario["options"] if o["is_safe"]), None)

    # Record attempt in DB
    attempt = ScenarioAttempt(
        scenario_id=req.scenario_id,
        chosen_option_id=req.chosen_option_id,
        is_safe=chosen_opt["is_safe"],
        score_awarded=chosen_opt["score"],
        created_at=datetime.utcnow()
    )
    db.add(attempt)
    db.commit()

    # Calculate overall user score across scenarios
    total_score = db.query(func.sum(ScenarioAttempt.score_awarded)).scalar() or 0
    unique_scenarios_attempted = db.query(func.count(func.distinct(ScenarioAttempt.scenario_id))).scalar() or 0

    return ScenarioSubmitResponse(
        scenario_id=req.scenario_id,
        chosen_option_id=req.chosen_option_id,
        is_safe=chosen_opt["is_safe"],
        score_awarded=chosen_opt["score"],
        feedback=chosen_opt["feedback"],
        manipulation_tactics=chosen_opt["manipulation_tactics"],
        red_flags=chosen_opt["red_flags"],
        safest_response=safest_opt["text"] if safest_opt else "Follow out-of-band verification.",
        overall_simulator_score=int(total_score),
        completed_scenarios_count=int(unique_scenarios_attempted)
    )

@router.get("/modules", response_model=List[LessonModule])
def get_lesson_modules():
    return LESSONS

@router.post("/submit-quiz", response_model=QuizSubmitResponse)
def submit_quiz(req: QuizSubmitRequest, db: Session = Depends(get_db)):
    lesson = next((l for l in LESSONS if l["key"] == req.module_key), None)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson module not found.")

    quiz_questions = lesson["quiz"]
    total = len(quiz_questions)
    correct_count = 0
    details = []

    for q in quiz_questions:
        user_choice = req.answers.get(q["id"])
        is_correct = user_choice is not None and user_choice == q["correct_option_index"]
        if is_correct:
            correct_count += 1

        details.append({
            "question_id": q["id"],
            "question_text": q["question"],
            "user_choice": user_choice,
            "correct_choice": q["correct_option_index"],
            "is_correct": is_correct,
            "explanation": q["explanation"]
        })

    score_pct = int((correct_count / total) * 100) if total > 0 else 0
    passed = score_pct >= 70

    # Update or insert UserProgress
    progress = db.query(UserProgress).filter(UserProgress.module_key == req.module_key).first()
    if not progress:
        progress = UserProgress(
            module_key=req.module_key,
            completed=passed,
            quiz_score=score_pct,
            attempts_count=1,
            last_attempt_at=datetime.utcnow()
        )
        db.add(progress)
    else:
        progress.attempts_count = (progress.attempts_count or 0) + 1
        progress.quiz_score = max(progress.quiz_score, score_pct)
        if passed:
            progress.completed = True
        progress.last_attempt_at = datetime.utcnow()

    db.commit()

    return QuizSubmitResponse(
        module_key=req.module_key,
        score=score_pct,
        total_questions=total,
        passed=passed,
        details=details
    )

@router.get("/progress", response_model=ProgressResponse)
def get_user_progress(db: Session = Depends(get_db)):
    records = db.query(UserProgress).all()
    modules_dict = {}
    completed_count = 0
    total_score = 0

    for r in records:
        modules_dict[r.module_key] = {
            "completed": r.completed,
            "quiz_score": r.quiz_score,
            "attempts": r.attempts_count,
            "last_attempt_at": r.last_attempt_at.isoformat() if r.last_attempt_at else None
        }
        if r.completed:
            completed_count += 1
            total_score += r.quiz_score

    avg_score = round(total_score / completed_count, 1) if completed_count > 0 else 0.0

    return ProgressResponse(
        modules=modules_dict,
        total_completed=completed_count,
        average_score=avg_score,
        total_modules=len(LESSONS)
    )

@router.post("/reset")
def reset_progress(db: Session = Depends(get_db)):
    db.query(ScenarioAttempt).delete()
    for p in db.query(UserProgress).all():
        p.completed = False
        p.quiz_score = 0
        p.attempts_count = 0
    db.commit()
    return {"status": "success", "message": "Training and simulator progress reset successfully."}

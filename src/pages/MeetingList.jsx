import { useNavigate } from 'react-router-dom';
import { useMeeting } from '../context/MeetingContext';
import { useState } from 'react';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

function MeetingList() {
    const navigate = useNavigate();
    const {
        meetings,
        quarter,
        quarterUsed,
        quarterRemain,
        setCurrentMeetingId,
        deleteMeeting
    } = useMeeting();

    /* -------------------------
       상태
    ------------------------- */
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);

    const totalBudget = quarter.totalBudget || 0;

    const isOver = quarterRemain < 0;
    const isWarning =
        quarterRemain >= 0 &&
        totalBudget > 0 &&
        quarterRemain / totalBudget <= 0.1;
    const budgetStatusClass = isOver
        ? 'budget-over'
        : isWarning
            ? 'budget-warning'
            : 'budget-safe';

    /* -------------------------
       렌더
    ------------------------- */
    return (
        <div className="app">
            <AppHeader title="회식 목록" showBack={false} />

            <div className="main">
                {/* 분기 예산 요약 */}
                <div className={`card ${budgetStatusClass}`}>
                    <div className="sub">
                        {quarter.year}년 {quarter.quarter}분기 잔액
                    </div>

                    <div className="big-number">
                        {quarterRemain.toLocaleString()}원
                    </div>

                    <button
                        type="button"
                        className="btn secondary"
                        style={{ marginTop: '10px', width: '100%' }}
                        onClick={() => setIsSummaryOpen(v => !v)}
                    >
                        {isSummaryOpen ? '상세 닫기' : '상세 보기'}
                    </button>

                    {isSummaryOpen && (
                        <div style={{ marginTop: '10px' }}>
                            <div className="sub">
                                예산:{' '}
                                {Number(totalBudget).toLocaleString()}원
                            </div>
                            <div
                                className="sub"
                                style={{ marginTop: '6px' }}
                            >
                                사용:{' '}
                                {Number(quarterUsed || 0).toLocaleString()}원
                            </div>
                        </div>
                    )}
                </div>

                {/* 회식 생성 */}
                <button
                    className="btn"
                    style={{ width: '100%', marginBottom: '16px' }}
                    onClick={() => navigate('/create')}
                >
                    ＋ 회식 생성
                </button>

                {/* 회식 목록 */}
                {meetings.length === 0 && (
                    <p className="sub">
                        아직 생성된 회식이 없습니다.
                    </p>
                )}

                {[...meetings].reverse().map(meeting => {
                    const used = meeting.usedAmount || 0;

                    const isMeetingOver =
                        used > meeting.budget;

                    const meetingStatusClass =
                        isMeetingOver ? 'budget-over' : '';

                    return (
                        <div
                            key={meeting.id}
                            className={`card ${meetingStatusClass}`}
                            onClick={() => {
                                setCurrentMeetingId(meeting.id);
                                navigate(`/meeting/${meeting.id}`);
                            }}
                        >
                            <strong>{meeting.name}</strong>

                            <div className="sub" style={{ marginTop: '6px' }}>
                                예산 {meeting.budget.toLocaleString()}원 ·
                                사용 {used.toLocaleString()}원
                            </div>

                            <button
                                className="btn secondary"
                                style={{ marginTop: '10px', width: '100%' }}
                                onClick={e => {
                                    e.stopPropagation();
                                    if (window.confirm('이 회식을 삭제할까요?')) {
                                        deleteMeeting(meeting.id);
                                    }
                                }}
                            >
                                삭제
                            </button>
                        </div>
                    );
                })}
            </div>
            <AppFooter />
        </div>
    );
}

export default MeetingList;

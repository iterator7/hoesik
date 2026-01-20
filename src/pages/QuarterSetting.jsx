import { useNavigate } from 'react-router-dom';
import { useMeeting } from '../context/MeetingContext';
import { useState } from 'react';
import AppHeader from '../components/AppHeader';

function QuarterSetting() {
    const navigate = useNavigate();
    const { quarter, setQuarter } = useMeeting();

    const [perPerson, setPerPerson] = useState(
        quarter.perPerson > 0 ? String(quarter.perPerson) : ''
    );
    const [peopleCount, setPeopleCount] = useState(
        quarter.peopleCount > 0 ? String(quarter.peopleCount) : ''
    );

    const totalBudget =
        Number(perPerson || 0) * Number(peopleCount || 0);

    return (
        <div className="app">
            <AppHeader title="분기 회식비 설정" />

            <div className="main">
                {/* 분기 정보 (표시만) */}
                <div className="card">
                    <strong>
                        {quarter.year}년 {quarter.quarter}분기
                    </strong>
                    <div className="sub" style={{ marginTop: '4px' }}>
                        분기 회식 예산을 설정합니다
                    </div>
                </div>

                {/* 1인당 금액 */}
                <div className="card">
                    <label className="sub">1인당 회식비</label>
                    <input
                        type="number"
                        value={perPerson}
                        placeholder="예: 30000"
                        onChange={e => setPerPerson(e.target.value)}
                        style={{ width: '100%', marginTop: '6px' }}
                    />
                </div>

                {/* 인원 수 */}
                <div className="card">
                    <label className="sub">인원 수</label>
                    <input
                        type="number"
                        value={peopleCount}
                        placeholder="예: 8"
                        onChange={e => setPeopleCount(e.target.value)}
                        style={{ width: '100%', marginTop: '6px' }}
                    />
                </div>

                {/* 계산 결과 */}
                <div className="card">
                    <div className="sub">총 분기 예산</div>
                    <div className="big-number">
                        {totalBudget.toLocaleString()}원
                    </div>
                </div>

                {/* 저장 */}
                <button
                    className="btn"
                    style={{ width: '100%', marginTop: '16px' }}
                    onClick={() => {
                        setQuarter({
                            ...quarter,
                            perPerson,
                            peopleCount,
                            totalBudget
                        });
                        navigate('/');
                    }}
                    disabled={totalBudget <= 0}
                >
                    저장
                </button>
            </div>
        </div>
    );
}

export default QuarterSetting;

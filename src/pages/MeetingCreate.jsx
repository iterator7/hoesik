import { useNavigate } from 'react-router-dom';
import { useMeeting } from '../context/MeetingContext';
import { useMemo, useRef, useState } from 'react';
import AppHeader from '../components/AppHeader';

function MeetingCreate() {
    const navigate = useNavigate();
    const { createMeeting, meetings, quarter } = useMeeting();

    const dateRef = useRef(null);
    const restaurantRef = useRef(null);

    const [budgetType, setBudgetType] = useState('per');
    const [totalBudget, setTotalBudget] = useState('');
    const [perPrice, setPerPrice] = useState(quarter.perPerson || '');
    const [peopleCount, setPeopleCount] = useState(quarter.peopleCount || '');
    const [date, setDate] = useState('');

    // ✅ 신규: 식당명/링크를 생성 단계에서 받기
    const [restaurantName, setRestaurantName] = useState('');
    const [restaurantUrl, setRestaurantUrl] = useState('');

    const generateMeetingName = () => {
        if (!date) return '';

        const d = new Date(date);
        const year = d.getFullYear();
        const shortYear = year.toString().slice(-2);
        const month = d.getMonth() + 1;
        const q = Math.ceil(month / 3);
        const mmdd = `${String(month).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;

        const sameQuarterMeetings = meetings.filter(m => {
            if (!m.date) return false;
            const md = new Date(m.date);
            return (
                md.getFullYear() === year &&
                Math.ceil((md.getMonth() + 1) / 3) === q
            );
        });

        const order = sameQuarterMeetings.length + 1;

        return `${shortYear}년 ${q}분기 ${order}번째 회식 (${mmdd})`;
    };

    const calculatedBudget = useMemo(() => {
        return budgetType === 'per'
            ? Number(perPrice || 0) * Number(peopleCount || 0)
            : Number(totalBudget || 0);
    }, [budgetType, perPrice, peopleCount, totalBudget]);

    const onCreate = () => {
        if (!date) {
            alert('날짜를 선택하세요');
            dateRef.current?.focus();
            return;
        }

        if (!restaurantName.trim()) {
            alert('식당명을 입력하세요');
            restaurantRef.current?.focus();
            return;
        }

        if (calculatedBudget <= 0) {
            alert('예산을 입력하세요');
            return;
        }

        const id = createMeeting({
            name: generateMeetingName(),
            date,
            restaurantName: restaurantName.trim(),
            restaurantUrl: restaurantUrl.trim(),
            budget: calculatedBudget,
            menus: []
        });

        navigate(`/meeting/${id}`);
    };

    return (
        <div className="app">
            <AppHeader title="회식 생성" />

            <div className="main">
                <div className="card">
                    <label className="sub">날짜</label>
                    <input
                        ref={dateRef}
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        style={{ width: '100%', marginTop: '6px' }}
                    />
                </div>

                <div className="card">
                    <label className="sub">회식 이름</label>
                    <input
                        type="text"
                        value={generateMeetingName()}
                        readOnly
                        style={{ width: '100%', marginTop: '6px' }}
                    />
                </div>

                <div className="card">
                    <label className="sub">식당명</label>
                    <input
                        ref={restaurantRef}
                        type="text"
                        value={restaurantName}
                        onChange={e => setRestaurantName(e.target.value)}
                        placeholder="예: ○○고기집"
                        style={{ width: '100%', marginTop: '6px' }}
                    />
                </div>

                <div className="card">
                    <label className="sub">식당 링크</label>
                    <input
                        type="text"
                        value={restaurantUrl}
                        onChange={e => setRestaurantUrl(e.target.value)}
                        placeholder="선택 (네이버/카카오/구글 지도 URL)"
                        style={{ width: '100%', marginTop: '6px' }}
                    />
                </div>

                <div className="card">
                    <div className="sub" style={{ marginBottom: '10px' }}>
                        예산 입력 방식
                    </div>

                    <label style={{ display: 'block' }}>
                        <input
                            type="radio"
                            checked={budgetType === 'total'}
                            onChange={() => setBudgetType('total')}
                        />
                        <span style={{ marginLeft: '8px' }}>총 예산 직접 입력</span>
                    </label>

                    <label style={{ display: 'block', marginTop: '8px' }}>
                        <input
                            type="radio"
                            checked={budgetType === 'per'}
                            onChange={() => setBudgetType('per')}
                        />
                        <span style={{ marginLeft: '8px' }}>1인당 × 인원 수</span>
                    </label>

                    {budgetType === 'total' && (
                        <div style={{ marginTop: '12px' }}>
                            <label className="sub">총 예산</label>
                            <input
                                type="number"
                                placeholder="500000"
                                value={totalBudget}
                                onChange={e => setTotalBudget(e.target.value)}
                                style={{ width: '100%', marginTop: '6px' }}
                            />
                        </div>
                    )}

                    {budgetType === 'per' && (
                        <div style={{ marginTop: '12px' }}>
                            <label className="sub">1인당 회식비</label>
                            <input
                                type="number"
                                placeholder="30000"
                                value={perPrice}
                                onChange={e => setPerPrice(e.target.value)}
                                style={{ width: '100%', marginTop: '6px' }}
                            />

                            <div style={{ marginTop: '10px' }}>
                                <label className="sub">인원 수</label>
                                <input
                                    type="number"
                                    placeholder="10"
                                    value={peopleCount}
                                    onChange={e => setPeopleCount(e.target.value)}
                                    style={{ width: '100%', marginTop: '6px' }}
                                />
                            </div>

                            <div className="sub" style={{ marginTop: '10px' }}>
                                = <strong>{calculatedBudget.toLocaleString()}</strong> 원
                            </div>
                        </div>
                    )}
                </div>

                <button
                    className="btn"
                    style={{ width: '100%', marginTop: '16px' }}
                    onClick={onCreate}
                    disabled={calculatedBudget <= 0}
                >
                    회식 생성
                </button>
            </div>
        </div>
    );
}

export default MeetingCreate;

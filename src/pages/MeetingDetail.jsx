import { useNavigate, useParams } from 'react-router-dom';
import { useMeeting } from '../context/MeetingContext';
import { useEffect } from 'react';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

function MeetingDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { currentMeeting, updateMeeting } = useMeeting();

    if (!currentMeeting) {
        return (
            <div className="app">
                <AppHeader title="회식 상세" />
                <div className="main">
                    <p className="sub">회식 정보를 찾을 수 없습니다.</p>
                </div>
            </div>
        );
    }

    const visibleMenus = currentMeeting.menus.filter(
        menu => menu.name?.trim() && menu.price
    );

    const updateQuantity = (index, diff) => {
        const nextMenus = [...currentMeeting.menus];
        const nextQty = (nextMenus[index].quantity || 0) + diff;
        if (nextQty < 0) return;

        nextMenus[index].quantity = nextQty;
        updateMeeting(currentMeeting.id, { menus: nextMenus });
    };

    const totalPrice = visibleMenus.reduce(
        (sum, menu) =>
            sum + Number(menu.price || 0) * (menu.quantity || 0),
        0
    );

    useEffect(() => {
        if (currentMeeting.usedAmount !== totalPrice) {
            updateMeeting(currentMeeting.id, {
                usedAmount: totalPrice
            });
        }
    }, [totalPrice]);

    const budget = currentMeeting.budget || 0;
    const remain = budget - totalPrice;
    const isOver = remain < 0;
    const isWarning =
        remain >= 0 && budget > 0 && remain / budget <= 0.1;
    
        const budgetStatusClass = isOver
    ? 'budget-over'
    : isWarning
        ? 'budget-warning'
        : 'budget-safe';

    return (
        <div className="app">
            <AppHeader title="회식 상세" />

            <div className="main">
                <div className="card">
                    <strong>{currentMeeting.name}</strong>
                    <div className="sub">
                        {currentMeeting.restaurantName || '식당 미지정'}
                    </div>
                </div>

                <div className={`card ${budgetStatusClass}`}>
                    <div className="sub">남은 예산</div>
                    <div className="big-number">
                        {remain.toLocaleString()}원
                    </div>
                    <div className="sub">
                        사용 {totalPrice.toLocaleString()} / 예산{' '}
                        {budget.toLocaleString()}
                    </div>
                </div>

                <h2>메뉴</h2>

                {visibleMenus.length === 0 && (
                    <p className="sub">
                        아직 주문된 메뉴가 없습니다.
                    </p>
                )}

                {visibleMenus.map((menu, index) => (
                    <div key={index} className="card">
                        <strong>{menu.name}</strong>
                        <div className="sub">
                            {Number(menu.price).toLocaleString()}원
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginTop: '10px'
                            }}
                        >
                            <button
                                className="btn secondary"
                                onClick={() =>
                                    updateQuantity(index, -1)
                                }
                            >
                                −
                            </button>
                            <div className="big-number">
                                {menu.quantity || 0}
                            </div>
                            <button
                                className="btn"
                                onClick={() =>
                                    updateQuantity(index, 1)
                                }
                            >
                                ＋
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    className="btn"
                    style={{ width: '100%', marginTop: '16px' }}
                    onClick={() => navigate(`/meeting/${id}/menu`)}
                >
                    메뉴 편집
                </button>

                <button
                    className="btn secondary"
                    style={{ width: '100%', marginTop: '8px' }}
                    disabled
                >
                    공유 링크 (준비 중)
                </button>
            </div>
            <AppFooter />
        </div>
    );
}

export default MeetingDetail;

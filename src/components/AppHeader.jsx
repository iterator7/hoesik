import { useNavigate } from 'react-router-dom';

function AppHeader({
    title = '회식 관리',
    showBack = true,
    showQuarter = true
}) {
    const navigate = useNavigate();

    return (
        <header className="header">
            {/* 왼쪽: 뒤로 */}
            <div className="header-side left">
                {showBack && (
                    <button
                        type="button"
                        className="header-btn"
                        onClick={() => navigate('/')}
                        aria-label="뒤로"
                    >
                        ←
                    </button>
                )}
            </div>

            {/* 중앙: 타이틀 (절대 고정) */}
            <h1 className="header-title">{title}</h1>

            {/* 오른쪽: 홈 → 예산 설정 */}
            <div className="header-side right">
                <button
                    type="button"
                    className="header-btn"
                    onClick={() => navigate('/')}
                    aria-label="홈"
                >
                    🏠
                </button>

                {showQuarter && (
                    <button
                        type="button"
                        className="header-btn"
                        onClick={() => navigate('/quarter')}
                        aria-label="분기 예산 설정"
                    >
                        💰
                    </button>
                )}
            </div>
        </header>
    );
}

export default AppHeader;

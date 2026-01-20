import { useNavigate } from 'react-router-dom';

function AppHeader({
    title = '회식 관리',
    showBack = true,
    showQuarter = true,
    backTo = null
}) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (backTo) {
            navigate(backTo);
        } else {
            navigate('/');
        }
    };

    return (
        <header className="header">
            {/* 왼쪽: 뒤로 */}
            <div className="header-side left">
                {showBack && (
                    <button
                        type="button"
                        className="header-btn"
                        onClick={handleBack}
                        aria-label="뒤로"
                    >
                        ←
                    </button>
                )}
            </div>

            {/* 중앙 */}
            <h1 className="header-title">{title}</h1>

            {/* 오른쪽 */}
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

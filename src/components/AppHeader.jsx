import { useNavigate } from 'react-router-dom';

function AppHeader({ title = '회식 관리', showBack = true }) {
    const navigate = useNavigate();

    return (
        <div className="header">
            <button
                type="button"
                className="btn secondary"
                onClick={() => navigate('/')}
                aria-label="홈"
            >
                🏠
            </button>

            <div className="header-title">{title}</div>

            {showBack ? (
                <button
                    type="button"
                    className="btn secondary"
                    onClick={() => navigate(-1)}
                    aria-label="뒤로"
                >
                    ←
                </button>
            ) : (
                <div style={{ width: '44px' }} />
            )}
        </div>
    );
}

export default AppHeader;

import { useNavigate } from 'react-router-dom';

function AppHeader({ title = '회식 관리', showBack = true }) {
    const navigate = useNavigate();

    return (
        <div className="header">
            {/* 뒤로 */}
                {showBack && (
                    <button
                        type="button"
                        className="btn secondary"
                        onClick={() => navigate(-1)}
                        aria-label="뒤로"
                    >
                        ←
                    </button>
                )}

            {/* 타이틀 */}
            <div className="header-title">{title}</div>

            {/* 우측 버튼 영역 */}
            <div style={{ display: 'flex', gap: '6px' }}>
                {/* 홈 */}
                <button
                    type="button"
                    className="btn secondary"
                    onClick={() => navigate('/')}
                    aria-label="홈"
                >
                    🏠
                </button>
                {/* 분기 예산 설정 */}
                <button
                    type="button"
                    className="btn secondary"
                    onClick={() => navigate('/quarter')}
                    aria-label="분기 예산 설정"
                >
                    ⚙️
                </button>

                
            </div>
        </div>
    );
}

export default AppHeader;

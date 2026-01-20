import { useNavigate } from 'react-router-dom';
import { useMeeting } from '../context/MeetingContext';
import { useRef, useEffect } from 'react';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

function MenuEdit() {
    const navigate = useNavigate();
    const { currentMeeting, updateMeeting } = useMeeting();

    const lastNameInputRef = useRef(null);
    const nameRefs = useRef([]);
    const priceRefs = useRef([]);
    const latestMenusRef = useRef([]);

    // 🔐 가드
    if (!currentMeeting) {
        return (
            <div className="app">
                <AppHeader title="메뉴 편집" />
                <div className="main">
                    <p className="sub">회식 정보를 찾을 수 없습니다.</p>
                </div>
            </div>
        );
    }

    /* -------------------------
       불완전 메뉴 판별
    ------------------------- */
    const isIncompleteMenu = (menu) => {
        return !menu.name.trim() || !menu.price;
    };

    /* -------------------------
       최신 menus 추적
    ------------------------- */
    useEffect(() => {
        latestMenusRef.current = currentMeeting.menus;
    }, [currentMeeting.menus]);

    /* -------------------------
       페이지 이탈 시 정리
    ------------------------- */
    useEffect(() => {
        return () => {
            const latestMenus = latestMenusRef.current;

            const cleanedMenus = latestMenus.filter(
                menu => !isIncompleteMenu(menu)
            );

            if (cleanedMenus.length !== latestMenus.length) {
                updateMeeting(currentMeeting.id, {
                    menus: cleanedMenus
                });
            }
        };
    }, []);

    /* -------------------------
       메뉴 조작
    ------------------------- */
    const addMenu = () => {
        updateMeeting(currentMeeting.id, {
            menus: [
                ...currentMeeting.menus,
                { name: '', price: '', quantity: 0 }
            ]
        });
    };

    const updateMenu = (index, key, value) => {
        const nextMenus = [...currentMeeting.menus];
        nextMenus[index][key] = value;

        updateMeeting(currentMeeting.id, {
            menus: nextMenus
        });
    };

    const removeMenu = (index) => {
        updateMeeting(currentMeeting.id, {
            menus: currentMeeting.menus.filter((_, i) => i !== index)
        });
    };

    /* -------------------------
       신규 메뉴 생성 시 포커스
    ------------------------- */
    useEffect(() => {
        if (lastNameInputRef.current) {
            lastNameInputRef.current.focus();
        }
    }, [currentMeeting.menus.length]);

    return (
        <div className="app">
            <AppHeader title="메뉴 편집" />

            <div className="main">
                {/* 식당 정보 */}
                <div className="card">
                    <label className="sub">식당 이름</label>
                    <input
                        type="text"
                        value={currentMeeting.restaurantName}
                        onChange={e =>
                            updateMeeting(currentMeeting.id, {
                                restaurantName: e.target.value
                            })
                        }
                        style={{ width: '100%', marginTop: '6px' }}
                    />
                </div>

                <div className="card">
                    <label className="sub">식당 링크</label>
                    <input
                        type="text"
                        value={currentMeeting.restaurantUrl}
                        onChange={e =>
                            updateMeeting(currentMeeting.id, {
                                restaurantUrl: e.target.value
                            })
                        }
                        style={{ width: '100%', marginTop: '6px' }}
                    />
                </div>

                {/* 메뉴 */}
                <h2 style={{ marginTop: '20px' }}>메뉴</h2>

                {currentMeeting.menus.length === 0 && (
                    <p className="sub">
                        아직 메뉴가 없습니다. 아래 버튼으로 추가하세요.
                    </p>
                )}

                {currentMeeting.menus.map((menu, index) => {
                    const isLast =
                        index === currentMeeting.menus.length - 1;

                    return (
                        <div key={index} className="card">
                            <input
                                ref={el => {
                                    nameRefs.current[index] = el;
                                    if (isLast)
                                        lastNameInputRef.current = el;
                                }}
                                type="text"
                                placeholder="메뉴명"
                                value={menu.name}
                                onChange={e =>
                                    updateMenu(index, 'name', e.target.value)
                                }
                                style={{ width: '100%' }}
                            />

                            <input
                                ref={el => (priceRefs.current[index] = el)}
                                type="number"
                                placeholder="가격"
                                value={menu.price}
                                onChange={e =>
                                    updateMenu(index, 'price', e.target.value)
                                }
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        if (!menu.name.trim()) {
                                            alert('메뉴명을 입력하세요');
                                            nameRefs.current[index]?.focus();
                                            return;
                                        }
                                        if (!menu.price) {
                                            alert('가격을 입력하세요');
                                            priceRefs.current[index]?.focus();
                                            return;
                                        }
                                        addMenu();
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    marginTop: '8px'
                                }}
                            />

                            <button
                                className="btn secondary"
                                style={{
                                    width: '100%',
                                    marginTop: '10px'
                                }}
                                onClick={() => removeMenu(index)}
                            >
                                삭제
                            </button>
                        </div>
                    );
                })}

                <button
                    className="btn"
                    style={{ width: '100%', marginTop: '16px' }}
                    onClick={addMenu}
                >
                    ＋ 메뉴 추가
                </button>
            </div>
            <AppFooter />
        </div>
    );
}

export default MenuEdit;

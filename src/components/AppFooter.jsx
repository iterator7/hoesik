import { useEffect, useMemo, useState } from 'react';

function AppFooter() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [visible, setVisible] = useState(false);

    /* -------------------------
       환경 판별 (최상단!)
    ------------------------- */
    const env = useMemo(() => {
        const ua = navigator.userAgent || '';

        const isIOS = /iphone|ipad|ipod/i.test(ua);

        const isStandalone =
            window.matchMedia?.('(display-mode: standalone)')?.matches ||
            window.navigator.standalone === true;

        const isSafari =
            isIOS &&
            /safari/i.test(ua) &&
            !/crios|fxios|edgios|opios/i.test(ua);

        return { isIOS, isSafari, isStandalone };
    }, []);

    /* -------------------------
       설치 이벤트 처리
    ------------------------- */
    useEffect(() => {
        // 이미 설치된 상태면 아무 것도 안 함
        if (env.isStandalone) {
            setVisible(false);
            setDeferredPrompt(null);
            return;
        }

        const beforeInstallHandler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setVisible(true);
        };

        const installedHandler = () => {
            setVisible(false);
            setDeferredPrompt(null);
        };

        window.addEventListener(
            'beforeinstallprompt',
            beforeInstallHandler
        );
        window.addEventListener('appinstalled', installedHandler);

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                beforeInstallHandler
            );
            window.removeEventListener(
                'appinstalled',
                installedHandler
            );
        };
    }, [env.isStandalone]);

    /* -------------------------
       설치 버튼 클릭
    ------------------------- */
    const installApp = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;

        if (choice?.outcome === 'accepted') {
            setVisible(false);
            setDeferredPrompt(null);
        }
    };

    /* -------------------------
       iOS Safari 안내
    ------------------------- */
    if (!env.isStandalone && env.isSafari) {
        return (
            <footer className="app-footer">
                <div className="sub">
                    Safari에서 <strong>공유</strong> →{' '}
                    <strong>홈 화면에 추가</strong>로
                    앱처럼 사용할 수 있어요
                </div>
            </footer>
        );
    }

    /* -------------------------
       설치 불가능 상태
    ------------------------- */
    if (!visible) return null;

    /* -------------------------
       설치 버튼
    ------------------------- */
    return (
        <footer className="app-footer">
            <button className="btn" onClick={installApp}>
                📲 앱으로 설치하기
            </button>
        </footer>
    );
}

export default AppFooter;

import { createContext, useContext, useState, useEffect } from 'react';

const MeetingContext = createContext(null);

const STORAGE_KEY = 'hoesik_meetings';
const QUARTER_KEY = 'hoesik_quarter';

/* -------------------------
   분기 기본값
------------------------- */
const defaultQuarter = {
    year: new Date().getFullYear(),
    quarter: Math.ceil((new Date().getMonth() + 1) / 3),
    perPerson: 0,
    peopleCount: 0,
    totalBudget: 0
};

export function MeetingProvider({ children }) {
    /* -------------------------
       회식 목록
    ------------------------- */
    const [meetings, setMeetings] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    const [currentMeetingId, setCurrentMeetingId] = useState(null);

    /* -------------------------
       분기 예산 (localStorage 연동)
    ------------------------- */
    const [quarter, setQuarter] = useState(() => {
        const saved = localStorage.getItem(QUARTER_KEY);
        return saved ? JSON.parse(saved) : defaultQuarter;
    });

    /* -------------------------
       localStorage 저장
    ------------------------- */
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
    }, [meetings]);

    useEffect(() => {
        localStorage.setItem(QUARTER_KEY, JSON.stringify(quarter));
    }, [quarter]);

    /* -------------------------
       분기 사용 금액 계산
    ------------------------- */
    const quarterUsed = meetings.reduce(
        (sum, m) => sum + (m.usedAmount || 0),
        0
    );

    const quarterRemain = quarter.totalBudget - quarterUsed;

    /* -------------------------
       CRUD
    ------------------------- */
    const createMeeting = (meeting) => {
        const id = Date.now().toString();

        setMeetings(prev => [
            ...prev,
            { ...meeting, id }
        ]);

        setCurrentMeetingId(id);
        return id;
    };

    const updateMeeting = (id, updater) => {
        setMeetings(prev =>
            prev.map(m =>
                m.id === id ? { ...m, ...updater } : m
            )
        );
    };

    const deleteMeeting = (id) => {
        setMeetings(prev => prev.filter(m => m.id !== id));

        setCurrentMeetingId(prev =>
            prev === id ? null : prev
        );
    };

    const currentMeeting =
        meetings.find(m => m.id === currentMeetingId) || null;

    return (
        <MeetingContext.Provider
            value={{
                meetings,
                quarter,
                setQuarter,
                quarterUsed,
                quarterRemain,
                createMeeting,
                updateMeeting,
                deleteMeeting,
                currentMeeting,
                setCurrentMeetingId
            }}
        >
            {children}
        </MeetingContext.Provider>
    );
}

export function useMeeting() {
    return useContext(MeetingContext);
}

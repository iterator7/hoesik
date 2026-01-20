import { Routes, Route, Navigate } from 'react-router-dom';
import MeetingList from './pages/MeetingList';
import MeetingCreate from './pages/MeetingCreate';
import MeetingDetail from './pages/MeetingDetail';
import MenuEdit from './pages/MenuEdit';
import QuarterSetting from './pages/QuarterSetting';

function App() {
    return (
        <Routes>
            <Route path="/" element={<MeetingList />} />
            <Route path="/create" element={<MeetingCreate />} />
            <Route path="/meeting/:id" element={<MeetingDetail />} />
            <Route path="/meeting/:id/menu" element={<MenuEdit />} />
            <Route path="/quarter" element={<QuarterSetting />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;

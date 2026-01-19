import { TabList } from './components/Tabs/TabList';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TabList />

      {/* Головний контент */}
      <main className="flex-1 bg-white p-6">
        <div className="w-full h-full min-h-[calc(100vh-100px)] bg-white rounded-[20px] border border-[#dadce0] shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)]">
          {/* Тут контент */}
        </div>

      </main>

    </div>
  );
}

export default App;

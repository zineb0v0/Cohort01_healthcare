import Header from './components/Header';
import Medications from './pages/MedicationDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="px-8 py-6">
        <Medications />
      </main>
    </div>
  );
}

export default App;
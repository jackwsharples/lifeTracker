import React, { useState } from 'react';
import { ViewType } from './types';
import Navigation from './components/Navigation';
import ClassesView from './components/Classes/ClassesView';
import IdeasView from './components/Ideas/IdeasView';
import WorkoutsView from './components/Workouts/WorkoutsView';
import BikeView from './components/Bike/BikeView';

function App() {
  const [activeView, setActiveView] = useState<ViewType>('classes');

  const renderView = () => {
    switch (activeView) {
      case 'classes':
        return <ClassesView />;
      case 'ideas':
        return <IdeasView />;
      case 'workouts':
        return <WorkoutsView />;
      case 'bike':
        return <BikeView />;
      default:
        return <ClassesView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      <main>
        {renderView()}
      </main>
    </div>
  );
}

export default App;
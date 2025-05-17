import React from 'react';
import CategoryProducts from './components/CategoryProducts';
import './components/CategoryProducts.css';

function App() {
  return (
    <div className="App">
      {/* Example usage of CategoryProducts */}
      <CategoryProducts category="electronics" />
      
      {/* You can use it multiple times with different categories */}
      <CategoryProducts category="clothing" />
    </div>
  );
}

export default App; 
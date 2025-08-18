import React, { useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './App.css';

// Define the types for our grid items
interface GridItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'SAY' | 'MSGET' | 'BUTTON';
  prompt?: string;
  size?: string;
  of?: string;
  colors?: string;
  pixel?: boolean;
  action?: string;
  when?: string;
}

const App: React.FC = () => {
  const [items, setItems] = useState<GridItem[]>([]);
  const [layout, setLayout] = useState<Layout[]>([]);

  const addItem = (type: 'SAY' | 'MSGET' | 'BUTTON') => {
    const newItem: GridItem = {
      i: `${type}_${new Date().getTime()}`,
      x: 0,
      y: Infinity, // puts it at the bottom
      w: 10,
      h: 2,
      type: type,
      prompt: type === 'SAY' ? `"My Label:"` : type === 'BUTTON' ? `"My Button"` : undefined,
      size: type !== 'SAY' ? '060, 010' : '075, 007',
      of: 'oDlg',
      colors: '0, 16777215',
      pixel: true,
      action: type === 'BUTTON' ? 'ACTION myFunction()' : undefined,
      when: type === 'MSGET' ? 'When .T.' : undefined,
    };
    setItems([...items, newItem]);
  };

  const onLayoutChange = (newLayout: Layout[]) => {
    // Only update layout if it has changed
    // This is a performance optimization
    const sortedNewLayout = JSON.stringify(newLayout.sort((a, b) => a.i.localeCompare(b.i)));
    const sortedCurrentLayout = JSON.stringify(layout.sort((a, b) => a.i.localeCompare(b.i)));

    if (sortedNewLayout !== sortedCurrentLayout) {
      setLayout(newLayout);
    }
  };

  const generateAdvplCode = () => {
    return layout.map(l => {
      const item = items.find(i => i.i === l.i);
      if (!item) return '';

      const xPos = String(l.x).padStart(3, '0');
      const yPos = String(l.y).padStart(3, '0');
      const size = item.size || `${String(l.w * 10).padStart(3, '0')}, ${String(l.h * 10).padStart(3, '0')}`;


      switch (item.type) {
        case 'SAY':
          return `@ ${yPos}, ${xPos} SAY ${item.i} PROMPT ${item.prompt || '""'} SIZE ${size} OF ${item.of || 'oDlg'} COLORS ${item.colors || ''} PIXEL`;
        case 'MSGET':
          return `@ ${yPos}, ${xPos} MSGET ${item.i} SIZE ${size} OF ${item.of || 'oDlg'} COLORS ${item.colors || ''} PIXEL ${item.when || ''}`;
        case 'BUTTON':
          return `@ ${yPos}, ${xPos} BUTTON ${item.i} PROMPT ${item.prompt || '""'} SIZE ${size} OF ${item.of || 'oDlg'} PIXEL ${item.action || ''}`;
        default:
          return '';
      }
    }).join('\n');
  };


  return (
    <div className="app-container">
      <div className="toolbox">
        <h3>Toolbox</h3>
        <button onClick={() => addItem('SAY')}>Add SAY</button>
        <button onClick={() => addItem('MSGET')}>Add MSGET</button>
        <button onClick={() => addItem('BUTTON')}>Add BUTTON</button>
      </div>
      <div className="grid-container">
        <GridLayout
          className="layout"
          layout={layout}
          cols={100}
          rowHeight={10}
          width={1200}
          onLayoutChange={onLayoutChange}
        >
          {items.map(item => (
            <div key={item.i} data-grid={{ x: item.x, y: item.y, w: item.w, h: item.h }}>
              {item.type}: {item.i}
            </div>
          ))}
        </GridLayout>
      </div>
      <div className="code-container">
        <h3>Generated Advpl Code</h3>
        <textarea
          readOnly
          value={generateAdvplCode()}
        />
      </div>
    </div>
  );
};

export default App;

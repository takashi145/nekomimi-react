import { Nekomimi } from 'nekomimi-react';
import './App.css';

export function App() {
  return (
    <div className="center-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

      <Nekomimi
        earScale={1.5}
        earGap={10}
        earColor="#555"
        earAlign='left'
				earOffsetX={10}
        earInset={1}
        className="neko-button"
      >
        <button className="demo-button" type="button">
          Button
        </button>
      </Nekomimi>

      <Nekomimi
        earScale={2}
        earColor="#555"
        earAlign='space-between'
        earInset={4}
				leftEarTilt={-15}
				rightEarTilt={15}
        className="neko-button"
      >
        <button className="demo-button" type="button">
          Button
        </button>
      </Nekomimi>
    </div>
  );
}

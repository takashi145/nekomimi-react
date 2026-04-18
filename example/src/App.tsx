import { useState } from 'react';
import { Nekomimi } from 'nekomimi-react';
import './App.css';

export function App() {
  const [open, setOpen] = useState(false);

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
        <button className="demo-button" type="button" onClick={() => setOpen(true)}>
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
        <button className="demo-button" type="button" onClick={() => setOpen(true)}>
          Button
        </button>
      </Nekomimi>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()}>
            <Nekomimi
              earScale={3}
							earGap={100}
              earColor="#ffffff"
              earInnerColor="rgba(190,90,130,0.5)"
              earInset={2}
            >
              <div className="modal">
                <p>にゃーん</p>
                <Nekomimi earColor="#555" earInset={1} className="neko-button">
                  <button className="demo-button" type="button" onClick={() => setOpen(false)}>
                    Close
                  </button>
                </Nekomimi>
              </div>
            </Nekomimi>
          </div>
        </div>
      )}

    </div>
  );
}

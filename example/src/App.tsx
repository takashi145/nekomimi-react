import { Nekomimi } from 'nekomimi-react';
import './App.css';

export function App() {
  return (
    <div className="center-wrapper">
      <Nekomimi
				earScale={1.3}
				earGap={12}
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
    </div>
  );
}

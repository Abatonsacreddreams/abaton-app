import React from 'react'
import ReactDOM from 'react-dom/client'
import AbatonApp from './App.jsx'

class Boundary extends React.Component {
  constructor(props){ super(props); this.state = {err:null}; }
  static getDerivedStateFromError(err){ return {err}; }
  componentDidCatch(err, info){
    try{
      localStorage.setItem('abaton_last_error', (new Date().toISOString()+' '+(err&&err.message)+' | '+((info&&info.componentStack)||'').split('\n').slice(0,3).join(' ')).slice(0,500));
      const now = Date.now();
      const log = JSON.parse(localStorage.getItem('abaton_crash_log')||'[]').filter(t=>now-t<5*60*1000);
      if(log.length<3){
        log.push(now); localStorage.setItem('abaton_crash_log', JSON.stringify(log));
        setTimeout(()=>window.location.reload(), 3500);
      }
    }catch(e){}
  }
  render(){
    if(this.state.err) return (
      <div style={{minHeight:'100vh',background:'#F2DFCF',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'24px',fontFamily:"'Cormorant Garamond',Georgia,serif",color:'#14223D'}}>
        <div>
          <div style={{fontSize:'34px',marginBottom:'10px'}}>Abaton</div>
          <div style={{fontSize:'20px',marginBottom:'18px'}}>Un istante, riavvio…</div>
          <button onClick={()=>window.location.reload()} style={{padding:'12px 24px',borderRadius:'14px',border:'none',background:'#C8A86A',color:'#fff',fontSize:'16px',cursor:'pointer'}}>Riavvia</button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><Boundary><AbatonApp /></Boundary></React.StrictMode>
)

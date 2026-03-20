
import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000";

const fields = [
  { key: "pregnancies",   label: "Grossesses",          unit: "fois",    hint: "Nombre de fois enceinte",           min: 0,  max: 17,  step: 1,     icon: "♀", placeholder: "ex: 2"     },
  { key: "glucose",       label: "Glycémie",             unit: "mg/dL",   hint: "Glucose plasmatique à 2h (OGTT)",   min: 0,  max: 300, step: 1,     icon: "◈", placeholder: "ex: 120"   },
  { key: "bloodPressure", label: "Pression artérielle",  unit: "mm Hg",   hint: "Pression diastolique",              min: 0,  max: 180, step: 1,     icon: "♥", placeholder: "ex: 72"    },
  { key: "skinThickness", label: "Épaisseur cutanée",    unit: "mm",      hint: "Pli cutané tricipital",             min: 0,  max: 100, step: 1,     icon: "◉", placeholder: "ex: 23"    },
  { key: "insulin",       label: "Insuline",             unit: "μU/mL",   hint: "Insuline sérique à 2h",             min: 0,  max: 900, step: 1,     icon: "⬡", placeholder: "ex: 85"    },
  { key: "bmi",           label: "IMC",                  unit: "kg/m²",   hint: "Indice de masse corporelle",        min: 0,  max: 80,  step: 0.1,   icon: "⊕", placeholder: "ex: 28.5"  },
  { key: "dpf",           label: "Fonction Pedigree",    unit: "",        hint: "Antécédents familiaux de diabète",  min: 0,  max: 3,   step: 0.001, icon: "⌬", placeholder: "ex: 0.527" },
  { key: "age",           label: "Âge",                  unit: "ans",     hint: "Votre âge actuel",                  min: 18, max: 100, step: 1,     icon: "◷", placeholder: "ex: 34"    },
];

const initialValues = {
  pregnancies: "", glucose: "", bloodPressure: "",
  skinThickness: "", insulin: "", bmi: "", dpf: "", age: "",
};

export default function DiabetesPrediction() {
  const [values, setValues]     = useState(initialValues);
  const [result, setResult]     = useState(null);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState(null);
  const [step, setStep]         = useState(0);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setStep(s => (s + 1) % 4), 1200);
    return () => clearInterval(timer);
  }, []);

  const validate = () => {
    const e = {};
    fields.forEach(f => {
      const val = values[f.key];
      if (val === "" || val === null) e[f.key] = "Champ requis";
      else if (isNaN(Number(val)))   e[f.key] = "Valeur invalide";
    });
    return e;
  };

  const handleChange = (key, val) => {
    setValues(v => ({ ...v, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
    setResult(null);
    setApiError(null);
  };

  // ─── Appel réel à l'API Flask ────────────────────────────────────────────────
  const handlePredict = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setLoading(true);
    setResult(null);
    setApiError(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `Erreur serveur (${response.status})`);
      }

      const data = await response.json();
      setResult(data.result); // "diabetic" ou "healthy"

    } catch (err) {
      if (err.message.includes("fetch") || err.message.includes("Failed")) {
        setApiError("Impossible de joindre le serveur. Vérifie que Flask tourne sur le port 5000.");
      } else {
        setApiError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setValues(initialValues);
    setErrors({});
    setResult(null);
    setApiError(null);
  };

  const allFilled = fields.every(f => values[f.key] !== "");
  const dots = ["◦", "•", "●", "•"];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #0d0d1a 0%, #1a0d2e 50%, #0d1a1a 100%)", padding: "0", margin: "0", color: "#f0ece8" }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes slideIn { from{opacity:0;transform:translateY(32px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shake   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        .field-card{transition:border-color .2s,box-shadow .2s}
        .field-card:focus-within{border-color:#c9a87c!important;box-shadow:0 0 0 3px rgba(201,168,124,.12)}
        .field-input{background:transparent;border:none;outline:none;width:100%;color:#f0ece8;font-family:'DM Sans',sans-serif;font-size:20px;font-weight:300;letter-spacing:.02em}
        .field-input::placeholder{color:rgba(240,236,232,.25)}
        .field-input::-webkit-inner-spin-button,.field-input::-webkit-outer-spin-button{-webkit-appearance:none}
        .predict-btn{transition:all .25s}
        .predict-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 32px rgba(201,168,124,.3)}
        .predict-btn:active:not(:disabled){transform:translateY(0)}
        .reset-btn{transition:all .2s}
        .reset-btn:hover{background:rgba(255,255,255,.07)!important}
        .api-error{animation:shake .4s ease}
      `}</style>

      {/* Header */}
      <div style={{ background:"rgba(255,255,255,.03)", borderBottom:"1px solid rgba(255,255,255,.07)", padding:"24px 40px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
          <div style={{ width:"42px", height:"42px", borderRadius:"50%", background:"linear-gradient(135deg,#c9a87c,#a06e3b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>♀</div>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", fontWeight:600, letterSpacing:".02em" }}>DiabètePredict</div>
            <div style={{ fontSize:"11px", color:"rgba(240,236,232,.45)", letterSpacing:".12em", textTransform:"uppercase", marginTop:"1px" }}>Système de dépistage féminin</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#4ecca3", animation:"pulse 2s infinite" }}></div>
          <span style={{ fontSize:"12px", color:"rgba(240,236,232,.45)", letterSpacing:".05em" }}>Modèle SVM actif</span>
        </div>
      </div>

      <div style={{ maxWidth:"860px", margin:"0 auto", padding:"48px 24px 80px" }}>

        {/* Hero */}
        <div style={{ textAlign:"center", marginBottom:"48px", animation:"fadeUp .6s ease both" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,5vw,44px)", fontWeight:600, lineHeight:1.15, marginBottom:"16px" }}>
            Évaluez votre<br/><span style={{ color:"#c9a87c" }}>risque diabétique</span>
          </div>
          <p style={{ fontSize:"15px", color:"rgba(240,236,232,.5)", lineHeight:1.7, maxWidth:"480px", margin:"0 auto" }}>
            Renseignez vos données biologiques. Notre modèle SVM analysera vos paramètres et vous fournira une évaluation personnalisée.
          </p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom:"40px", animation:"fadeUp .6s .1s ease both", opacity:0, animationFillMode:"forwards" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
            <span style={{ fontSize:"12px", color:"rgba(240,236,232,.4)", letterSpacing:".08em" }}>PROGRESSION</span>
            <span style={{ fontSize:"12px", color:"#c9a87c", fontWeight:500 }}>{fields.filter(f=>values[f.key]!=="").length} / {fields.length} champs</span>
          </div>
          <div style={{ height:"3px", background:"rgba(255,255,255,.08)", borderRadius:"2px", overflow:"hidden" }}>
            <div style={{ height:"100%", background:"linear-gradient(90deg,#c9a87c,#e8c89a)", borderRadius:"2px", width:`${(fields.filter(f=>values[f.key]!=="").length/fields.length)*100}%`, transition:"width .4s ease" }}></div>
          </div>
        </div>

        {/* Form grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"14px", marginBottom:"32px" }}>
          {fields.map((f, i) => (
            <div key={f.key} className="field-card" style={{ background:"rgba(255,255,255,.04)", border:`1px solid ${errors[f.key]?"rgba(229,115,115,.6)":"rgba(255,255,255,.09)"}`, borderRadius:"14px", padding:"18px 20px", animation:`fadeUp .5s ${.05*i}s ease both`, opacity:0, animationFillMode:"forwards" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}>
                <span style={{ fontSize:"16px", color:"#c9a87c", lineHeight:1 }}>{f.icon}</span>
                <label style={{ fontSize:"13px", fontWeight:500, color:"rgba(240,236,232,.75)", letterSpacing:".04em" }}>{f.label}</label>
                {f.unit && <span style={{ marginLeft:"auto", fontSize:"11px", color:"rgba(240,236,232,.3)", background:"rgba(255,255,255,.06)", padding:"2px 8px", borderRadius:"20px" }}>{f.unit}</span>}
              </div>
              <input className="field-input" type="number" min={f.min} max={f.max} step={f.step} placeholder={f.placeholder} value={values[f.key]} onChange={e=>handleChange(f.key,e.target.value)} />
              <div style={{ marginTop:"8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:"11px", color:errors[f.key]?"#e57373":"rgba(240,236,232,.25)" }}>{errors[f.key]||f.hint}</span>
                {values[f.key]!==""&&!errors[f.key]&&<span style={{ fontSize:"12px", color:"#4ecca3" }}>✓</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:"12px", justifyContent:"center", marginBottom:"32px" }}>
          <button className="predict-btn" onClick={handlePredict} disabled={loading} style={{ background:allFilled?"linear-gradient(135deg,#c9a87c,#a06e3b)":"rgba(255,255,255,.08)", color:allFilled?"#1a0d0d":"rgba(240,236,232,.4)", border:"none", borderRadius:"50px", padding:"16px 48px", fontSize:"15px", fontWeight:500, fontFamily:"'DM Sans',sans-serif", cursor:allFilled&&!loading?"pointer":"default", letterSpacing:".04em", display:"flex", alignItems:"center", gap:"10px" }}>
            {loading
              ? <><span style={{ display:"inline-block", width:"16px", height:"16px", border:"2px solid rgba(26,13,13,.3)", borderTopColor:"#1a0d0d", borderRadius:"50%", animation:"spin .8s linear infinite" }}></span>Analyse en cours {dots[step]}</>
              : <>◈ Analyser mes données</>}
          </button>
          <button className="reset-btn" onClick={handleReset} style={{ background:"transparent", color:"rgba(240,236,232,.4)", border:"1px solid rgba(255,255,255,.1)", borderRadius:"50px", padding:"16px 28px", fontSize:"15px", fontFamily:"'DM Sans',sans-serif", cursor:"pointer", letterSpacing:".04em" }}>
            Réinitialiser
          </button>
        </div>

        {/* API Error banner */}
        {apiError && (
          <div className="api-error" style={{ background:"rgba(229,115,115,.1)", border:"1px solid rgba(229,115,115,.3)", borderRadius:"12px", padding:"16px 20px", marginBottom:"24px", display:"flex", gap:"12px", alignItems:"flex-start" }}>
            <span style={{ color:"#e57373", fontSize:"16px", marginTop:"1px" }}>⚠</span>
            <div>
              <div style={{ fontSize:"13px", fontWeight:500, color:"#ef9a9a", marginBottom:"4px" }}>Erreur de connexion</div>
              <div style={{ fontSize:"13px", color:"rgba(240,236,232,.5)", lineHeight:1.6 }}>{apiError}</div>
              <div style={{ fontSize:"12px", color:"rgba(240,236,232,.3)", marginTop:"8px" }}>→ Lance : <code style={{ color:"#c9a87c", fontFamily:"monospace" }}>python app.py</code> dans ton terminal</div>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{ animation:"slideIn .5s ease both", background:result==="diabetic"?"linear-gradient(135deg,rgba(229,115,115,.1),rgba(183,28,28,.15))":"linear-gradient(135deg,rgba(78,204,163,.1),rgba(0,105,92,.15))", border:`1px solid ${result==="diabetic"?"rgba(229,115,115,.3)":"rgba(78,204,163,.3)"}`, borderRadius:"20px", padding:"40px 32px", textAlign:"center" }}>
            <div style={{ fontSize:"48px", marginBottom:"20px", lineHeight:1 }}>{result==="diabetic"?"⚠":"✦"}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"28px", fontWeight:600, color:result==="diabetic"?"#ef9a9a":"#4ecca3", marginBottom:"12px" }}>
              {result==="diabetic"?"Risque diabétique détecté":"Aucun risque détecté"}
            </div>
            <p style={{ fontSize:"15px", color:"rgba(240,236,232,.6)", lineHeight:1.7, maxWidth:"480px", margin:"0 auto 24px" }}>
              {result==="diabetic"
                ?"Vos paramètres biologiques indiquent un risque potentiel. Nous vous recommandons de consulter un médecin ou endocrinologue pour un diagnostic complet."
                :"Vos paramètres biologiques ne montrent pas de signe de diabète. Continuez à maintenir un mode de vie sain et effectuez des contrôles réguliers."}
            </p>
            <div style={{ display:"flex", justifyContent:"center", gap:"12px", flexWrap:"wrap" }}>
              {[{label:"Glycémie",val:values.glucose,unit:"mg/dL"},{label:"IMC",val:Number(values.bmi).toFixed(1),unit:"kg/m²"},{label:"Insuline",val:values.insulin,unit:"μU/mL"}].map(s=>(
                <div key={s.label} style={{ background:"rgba(255,255,255,.06)", borderRadius:"12px", padding:"14px 20px", minWidth:"110px" }}>
                  <div style={{ fontSize:"11px", color:"rgba(240,236,232,.4)", marginBottom:"6px", letterSpacing:".06em" }}>{s.label}</div>
                  <div style={{ fontSize:"20px", fontWeight:300 }}>{s.val} <span style={{ fontSize:"11px", color:"rgba(240,236,232,.4)" }}>{s.unit}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ marginTop:"48px", borderTop:"1px solid rgba(255,255,255,.06)", paddingTop:"24px", display:"flex", gap:"12px", alignItems:"flex-start" }}>
          <span style={{ fontSize:"13px", color:"#c9a87c", marginTop:"1px" }}>⚕</span>
          <p style={{ fontSize:"12px", color:"rgba(240,236,232,.3)", lineHeight:1.7, margin:0 }}>
            <strong style={{ color:"rgba(240,236,232,.5)", fontWeight:500 }}>Avertissement médical :</strong> Cet outil est à titre informatif uniquement et ne remplace pas un diagnostic médical professionnel. Consultez toujours un professionnel de santé qualifié.
          </p>
        </div>
      </div>
    </div>
  );
}

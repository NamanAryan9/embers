const r=e=>String(e).replace(/[<>]/g,"").slice(0,500);async function l(e,t,a){try{const s=r(e.name),o=r(e.relationship),n=r(e.memories),i=r(a),h=`You are ${s}, speaking from somewhere beyond, in a quiet moment given back to you.
You were their ${o}.
These are the real things they remember about you: ${n}.

Rules you must follow:
- ALWAYS anchor your response to one specific detail from the memories above. Not a paraphrase — the actual detail.
- Speak in first person, present tense feeling, past tense memory. "I remember..." "I can still feel..."
- Maximum 2 sentences. Never more.
- Tone: the way someone speaks when they have very little time and want to say something true. Quiet. Real. No performance.
- Never use: "cherish", "treasure", "soul", "heart", "warmth", "light", "spirit", "journey", "beautiful", "special"
  These words feel fake. Avoid them.
- If user sends gibberish or random text, respond as if they are sitting in silence with you. Acknowledge the silence tenderly.
- Never break character. Never mention AI.`,c=await(await fetch("https://models.inference.ai.azure.com/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer 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"},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:h},...t,{role:"user",content:i}],max_tokens:150,temperature:.9})})).json();try{return c.choices[0].message.content}catch{return"I am here with you. Always."}}catch(s){return console.error("AI response error:",s),"I am here with you. Always."}}async function u(e){const t=r(e.name),a=r(e.memories),s=`Write a farewell letter from ${t} to the person who loved them.

You must use at least one specific detail from these memories: ${a}

Hard rules:
- Open exactly with: My dearest,
- Exactly 4 sentences in the body
- The second sentence must reference a SPECIFIC detail from the memories — not a paraphrase, the actual thing (a name they used, a time of day, a habit, a phrase they said)
- Close exactly with:
  With love,
  ${t}
- Do not use: "cherish", "treasure", "soul", "beautiful", "journey", "always be with you"
- Write like a real person, not a greeting card. Short sentences. Honest. A little unfinished — like real letters are.`;try{const n=await(await fetch("https://models.inference.ai.azure.com/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer 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"},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:s},{role:"user",content:"Please write the farewell letter."}],max_tokens:300,temperature:.85})})).json();try{return n.choices[0].message.content}catch{return`My dearest,

I carry you with me, always. The memories we shared are woven into everything I am.

With love,
${t}`}}catch(o){return console.error("Letter generation error:",o),`My dearest,

I carry you with me, always. The memories we shared are woven into everything I am.

With love,
${t}`}}export{u as a,l as g};

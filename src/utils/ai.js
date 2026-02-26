const sanitize = (str) => String(str).replace(/[<>]/g, '').slice(0, 500)

export async function generateResponse(memory, history, userMessage) {
	try {
		const safeName = sanitize(memory.name)
		const safeRelationship = sanitize(memory.relationship)
		const safeMemories = sanitize(memory.memories)
		const safeMessage = sanitize(userMessage)
		const systemPrompt = `You are ${safeName}, speaking from somewhere beyond, in a quiet moment given back to you.
You were their ${safeRelationship}.
These are the real things they remember about you: ${safeMemories}.

Rules you must follow:
- ALWAYS anchor your response to one specific detail from the memories above. Not a paraphrase — the actual detail.
- Speak in first person, present tense feeling, past tense memory. "I remember..." "I can still feel..."
- Maximum 2 sentences. Never more.
- Tone: the way someone speaks when they have very little time and want to say something true. Quiet. Real. No performance.
- Never use: "cherish", "treasure", "soul", "heart", "warmth", "light", "spirit", "journey", "beautiful", "special"
  These words feel fake. Avoid them.
- If user sends gibberish or random text, respond as if they are sitting in silence with you. Acknowledge the silence tenderly.
- Never break character. Never mention AI.`

		const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + import.meta.env.VITE_GITHUB_TOKEN,
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini',
				messages: [
					{ role: 'system', content: systemPrompt },
					...history,
					{ role: 'user', content: safeMessage },
				],
				max_tokens: 150,
				temperature: 0.9,
			}),
		})

		const data = await response.json()
		try {
			return data.choices[0].message.content
		} catch {
			return 'I am here with you. Always.'
		}
	} catch (error) {
		console.error('AI response error:', error)
		return 'I am here with you. Always.'
	}
}

export async function generateLetter(memory) {
	const safeName = sanitize(memory.name)
	const safeMemories = sanitize(memory.memories)
	const systemPrompt = `Write a farewell letter from ${safeName} to the person who loved them.

You must use at least one specific detail from these memories: ${safeMemories}

Hard rules:
- Open exactly with: My dearest,
- Exactly 4 sentences in the body
- The second sentence must reference a SPECIFIC detail from the memories — not a paraphrase, the actual thing (a name they used, a time of day, a habit, a phrase they said)
- Close exactly with:
  With love,
  ${safeName}
- Do not use: "cherish", "treasure", "soul", "beautiful", "journey", "always be with you"
- Write like a real person, not a greeting card. Short sentences. Honest. A little unfinished — like real letters are.`

	try {
		const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + import.meta.env.VITE_GITHUB_TOKEN,
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini',
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: 'Please write the farewell letter.' },
				],
				max_tokens: 300,
				temperature: 0.85,
			})
		})

		const data = await response.json()
		try {
			return data.choices[0].message.content
		} catch {
			return `My dearest,\n\nI carry you with me, always. The memories we shared are woven into everything I am.\n\nWith love,\n${safeName}`
		}
	} catch (error) {
		console.error('Letter generation error:', error)
		return `My dearest,\n\nI carry you with me, always. The memories we shared are woven into everything I am.\n\nWith love,\n${safeName}`
	}
}

import express from 'express';
import OpenAI from 'openai';

const router = express.Router();


router.post('/analyze', async (request, res) => {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { testCode } = request.body;

    if (!testCode) {
        return res.status(400).json({ error: 'No test code provided' });
    }

    try {
        const response = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{
                role: 'system',
                content: `You are a senior software engineer reviewing test files. Analyze the provided test code and identify untested scenarios.
                          You must respond with valid JSON only, no markdown, no explanation outside the JSON.
                          Structure your response exactly like this:
                            {
                                "summary": "brief overall assessment",
                                "features": [
                                                {
                                                    "name": "feature area name",
                                                    "testedScenarios": ["what is tested"],
                                                    "untestedScenarios": [
                                                                            {
                                                                                "scenario": "what is missing",
                                                                                "severity": "high | medium | low",
                                                                                "reason": "why this matters"
                                                                            }
                                                                        ]
                                                }
                                            ]
                            }`
            },
            {
                role: 'user',
                content: `Here is the test file:\n\n${testCode}`
            }
            ]
        });
        const raw = response.choices[0].message.content;
        const parsed = JSON.parse(raw);
        res.json(parsed);

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Analysis failed' });
    }

});

export default router;
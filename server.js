import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const PORT = process.env.PORT || 3000;

async function getIBMToken() {
  const res = await fetch(
    'https://iam.cloud.ibm.com/identity/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${process.env.IBM_API_KEY}`
    }
  );
  const data = await res.json();
  return data.access_token;
}

app.post('/api/guidance', async (req, res) => {
  try {
    const { name, occupation, location, skills, goal } = req.body;

    const token = await getIBMToken();

    const prompt = `You are an AI Job Mentor for informal workers in India.
    
User Profile:
- Name: ${name}
- Occupation: ${occupation}
- Location: ${location}
- Skills: ${skills}
- Goal: ${goal}

Provide personalized guidance covering:
1. Relevant job opportunities
2. Government schemes they can apply for
3. Skill development courses
4. Immediate action steps

Respond in simple, easy-to-understand language.`;

    const response = await fetch(
      process.env.IBM_API_URL,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
       body: JSON.stringify({
  model_id: process.env.IBM_MODEL_ID,
  messages: [
    {
      role: "system",
      content: "You are an AI Job Mentor for informal workers in India. Respond in simple easy language."
    },
    {
      role: "user",
      content: prompt
    }
  ],
  parameters: {
    max_new_tokens: 500,
    temperature: 0.7
  },
  project_id: process.env.IBM_PROJECT_ID
})
      }
    );

    const data = await response.json();
    console.log('IBM Response:', JSON.stringify(data));
    const text = data.choices?.[0]?.message?.content || 
                 'Sorry, could not generate guidance.';
    
    res.json({ guidance: text });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
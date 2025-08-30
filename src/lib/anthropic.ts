import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface EmployeeProfile {
  name: string;
  role: string;
  department: string;
  vessel?: string;
  recentWellnessScores?: number[];
  previousAnswers?: string[];
  personalContext?: {
    workload?: string;
    teamDynamics?: string;
    recentEvents?: string[];
  };
}

export async function generatePersonalizedWellnessQuestions(
  employee: EmployeeProfile
): Promise<string[]> {
  const recentScores = employee.recentWellnessScores?.slice(-7) || [];
  const avgScore = recentScores.length > 0 
    ? recentScores.reduce((a, b) => a + b) / recentScores.length 
    : 0;

  const prompt = `You are a wellness expert generating personalized daily check-in questions for a maritime employee.

Employee Details:
- Name: ${employee.name}
- Role: ${employee.role}
- Department: ${employee.department}
- Vessel: ${employee.vessel || 'Shore-based'}
- Recent wellness average: ${avgScore > 0 ? `${avgScore.toFixed(1)}/5` : 'No previous data'}

Context:
- Maritime work environment with unique challenges (isolation, long shifts, weather conditions)
- Focus on mental health, physical wellbeing, work-life balance, and job satisfaction
- Questions should be empathetic and relevant to their specific role

Generate exactly 5 personalized wellness questions that:
1. Are relevant to maritime work environment
2. Vary based on their role (officer vs crew vs shore staff)
3. Include mix of mental health, physical health, job satisfaction, and social connection
4. Are conversational and easy to answer
5. Help identify stress, burnout, or wellbeing concerns
6. Consider their vessel type and department

Format: Return only the questions, one per line, without numbering or bullet points.`;

  try {
    console.log('Attempting to call Anthropic API with prompt:', prompt.substring(0, 200) + '...');
    
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not found in environment variables');
    }
    
    console.log('API Key found, making request...');
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Using the cheapest model
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    
    console.log('Anthropic API response received successfully');

    const content = response.content[0];
    if (content.type === 'text') {
      const rawQuestions = content.text
        .split('\n')
        .filter(line => line.trim().length > 0);
      
      console.log('Raw AI response questions:', rawQuestions.length, rawQuestions);
      
      const questions = rawQuestions.slice(0, 5); // Ensure exactly 5 questions
      
      console.log('Final questions returned:', questions.length, questions);
      return questions;
    }
    
    throw new Error('Unexpected response format from Anthropic');
  } catch (error) {
    console.error('Error generating wellness questions:', error);
    console.log('Falling back to default questions for employee:', employee.name);
    // Fallback questions if API fails
    return getDefaultWellnessQuestions(employee);
  }
}

export async function calculateWellnessScore(
  responses: { question: string; answer: string }[],
  employeeContext: EmployeeProfile
): Promise<{ score: number; insights: string[] }> {
  const prompt = `You are analyzing wellness check-in responses from a maritime employee. 

Employee: ${employeeContext.name} (${employeeContext.role} - ${employeeContext.department})

Responses:
${responses.map((r, i) => `${i + 1}. Q: ${r.question}\n   A: ${r.answer}`).join('\n\n')}

Please provide:
1. A wellness score from 0-100 (where 100 is excellent wellbeing)
2. 2-3 brief insights about their current state
3. Any red flags or areas of concern

Consider:
- Maritime work challenges (isolation, long hours, physical demands)
- Signs of stress, burnout, or mental health concerns
- Positive indicators of wellbeing
- Work-life balance issues

Format your response as:
SCORE: [number]
INSIGHTS:
- [insight 1]
- [insight 2]
- [insight 3 if applicable]`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const text = content.text;
      const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
      
      const insightsSection = text.split('INSIGHTS:')[1];
      const insights = insightsSection
        ? insightsSection
            .split('\n')
            .filter(line => line.trim().startsWith('-'))
            .map(line => line.trim().substring(1).trim())
        : [];

      return { score: Math.max(0, Math.min(100, score)), insights };
    }
    
    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('Error calculating wellness score:', error);
    // Simple fallback scoring
    const avgScore = responses.length > 0 ? 
      responses.reduce((acc, r) => acc + (r.answer.length > 20 ? 70 : 40), 0) / responses.length : 50;
    
    return {
      score: Math.round(avgScore),
      insights: ['Unable to generate detailed insights at this time.']
    };
  }
}

function getDefaultWellnessQuestions(employee: EmployeeProfile): string[] {
  const baseQuestions = [
    "How are you feeling physically today?",
    "What's your energy level like right now?", 
    "How would you rate your stress level today?",
    "How satisfied are you with your work today?",
    "Is there anything specific worrying you today?"
  ];

  // Customize based on role
  if (employee.vessel) {
    baseQuestions[3] = "How are you managing being away from home?";
    baseQuestions[4] = "Are you comfortable with the safety conditions on board?";
  }

  return baseQuestions;
}

export default anthropic;
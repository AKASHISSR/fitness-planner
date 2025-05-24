export async function generateMealPlan(answers) {
  const prompt = `
Ты — профессиональный нутрициолог. Сгенерируй подробную программу питания на неделю для пользователя на основе его ответов:
${JSON.stringify(answers, null, 2)}
Формат: День недели, завтрак, обед, ужин, перекусы. Кратко, но информативно.
`;

  const response = await fetch('https://api-inference.huggingface.co/models/sberbank-ai/rugpt3small_based_on_gpt2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Authorization': 'Bearer ВАШ_HF_API_KEY' // для публичных моделей можно без ключа
    },
    body: JSON.stringify({ inputs: prompt })
  });

  const data = await response.json();
  return data[0]?.generated_text || 'Ошибка генерации';
} 
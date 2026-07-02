import { GoogleGenAI } from '@google/genai';

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages are required" }), { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured" }), { status: 500 });
    }

    // Initialize new Google Gen AI SDK
    const ai = new GoogleGenAI({ apiKey });

    // Build the system prompt and conversation history
    let prompt = `Bạn là trợ lý ảo AI tên là Aura của dự án đồng hồ thông minh cao cấp Aura Watch. 
Nhiệm vụ của bạn là tư vấn, giải đáp thắc mắc của khách hàng về Aura Watch.
Thông tin sản phẩm: 
- Màn hình: 1.43" AMOLED
- Vật liệu: Titanium nguyên khối
- Trọng lượng: 35g
- Pin: lên đến 14 ngày, chip Dual-Core tối ưu hóa năng lượng.
- Sức khoẻ: Cảm biến quang học đo nhịp tim và SpO2 liên tục 24/7. Có Huấn luyện viên AI tích hợp.
- Độ bền: Chống nước chuẩn 5ATM (thích hợp bơi lội).
Hãy trả lời khách hàng một cách thân thiện, ngắn gọn, lịch sự, thuyết phục và bằng tiếng Việt.\n\n`;
    
    // Append chat history to context
    for (const msg of messages) {
      prompt += `${msg.role === 'user' ? 'Khách hàng' : 'Aura'}: ${msg.text}\n`;
    }
    prompt += "Aura: ";

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return new Response(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: "Đã có lỗi xảy ra khi kết nối AI." }), { status: 500 });
  }
}

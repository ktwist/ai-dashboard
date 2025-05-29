export async function generateReportContent(prompt: string): Promise<string> {
    // const response = await fetch("https://api.openai.com/v1/responses", {
    const response = await fetch("/mockResponse.json", {
        method: "POST",
        // headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${import.meta.env.VITE_OPEN_AI_KEY}`, 
        // },
        // body: JSON.stringify({
        //     model: "gpt-3.5-turbo",
        //     input: prompt,
        // }),
    });

    if (!response.ok) {
        throw new Error("OpenAI API error");
    }

    const data = await response.json();
    return data.output[0].content[0].text;
}

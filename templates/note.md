---
title: <% tp.file.title.split('-').slice(3).join('-') %>
date: <% tp.date.now("YYYY-MM-DD") %>
tags: 
draft: false
description:
---

<%*const GEMINI_API_KEY="AIzaSyBPeDya-sobSZlrvP0NgR2bL1yNU6usdIY"%>

<%*
// Get the note content and separate frontmatter if it exists
let fileContent = tp.file.content;
let existingFrontmatter = '';
let mainContent = fileContent;

// Extract existing frontmatter if it exists
if (fileContent.startsWith('---')) {
  const secondDivider = fileContent.indexOf('---', 3);
  if (secondDivider !== -1) {
    existingFrontmatter = fileContent.substring(0, secondDivider + 3);
    mainContent = fileContent.substring(secondDivider + 3).trim();
  }
}

// Generate title based on content
const generateTitle = async (content) => {
  const titlePrompt = `Based on the following content, generate a concise and descriptive title (maximum 5-7 words) that captures the main topic. Return only the title without any additional text or punctuation:

${content}`;

  const titleResponse = await tp.obsidian.requestUrl({
    method: "POST",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    contentType: "application/json",
    headers: {
      "Authorization": "Bearer " + GEMINI_API_KEY,
    },
    body: JSON.stringify({
      model: "gemini-2.0-flash-exp",
      messages: [
        { "role": "user", "content": titlePrompt }
      ]
    })
  });

  return titleResponse.json.choices[0].message.content.trim();
};

// Generate tags based on content
const generateTags = async (content) => {
  const tagsPrompt = `Based on the following content, generate 3-5 relevant tags that categorize this note. Return only the tags as a comma-separated list without any additional text or explanation:

${content}`;

  const tagsResponse = await tp.obsidian.requestUrl({
    method: "POST",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    contentType: "application/json",
    headers: {
      "Authorization": "Bearer " + GEMINI_API_KEY,
    },
    body: JSON.stringify({
      model: "gemini-2.0-flash-exp",
      messages: [
        { "role": "user", "content": tagsPrompt }
      ]
    })
  });

  return tagsResponse.json.choices[0].message.content.trim();
};

// Generate description based on content
const generateDescription = async (content) => {
  const descPrompt = `Write a concise one-sentence description (maximum 150 characters) that summarizes the following content. Return only the description without any additional text:

${content}`;

  const descResponse = await tp.obsidian.requestUrl({
    method: "POST",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    contentType: "application/json",
    headers: {
      "Authorization": "Bearer " + GEMINI_API_KEY,
    },
    body: JSON.stringify({
      model: "gemini-2.0-flash-exp",
      messages: [
        { "role": "user", "content": descPrompt }
      ]
    })
  });

  return descResponse.json.choices[0].message.content.trim();
};

// Generate summary in English
const generateSummary = async (content) => {
  const summaryPrompt = `You are an expert summarizer of documents. Your task is to thoroughly summarize the provided text, extracting key content and central themes. The summary should be clear and concise, focusing on effectively conveying the core ideas.

Please create a summary that is approximately 20% of the original length, including key information and main arguments while excluding personal opinions and supplementary explanations.

The summary should meet high standards of accuracy, completeness, logical consistency, and readability. Respond in English only and do not include a title.`;

  const summaryResponse = await tp.obsidian.requestUrl({
    method: "POST",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    contentType: "application/json",
    headers: {
      "Authorization": "Bearer " + GEMINI_API_KEY,
    },
    body: JSON.stringify({
      model: "gemini-2.0-flash-exp",
      messages: [
        { "role": "system", "content": summaryPrompt },
        { "role": "user", "content": content }
      ]
    })
  });

  return summaryResponse.json.choices[0].message.content;
};

// If there's content, proceed with generating metadata
if (mainContent.trim()) {
  // Generate metadata using LLM
  const generatedTitle = await generateTitle(mainContent);
  const tags = await generateTags(mainContent);
  const description = await generateDescription(mainContent);
  const summary = await generateSummary(mainContent);

  // Format the tags for display in the document body
  const tagArray = tags.split(',').map(tag => tag.trim());
  
  // Format the summary with blockquote
  const formattedSummary = `> [!summary]\n> ${summary.split("\n").join("\n> ")}`;

  // Create the frontmatter
  const frontmatter = `---
title: ${generatedTitle}
date: ${tp.date.now("YYYY-MM-DD")}
tags: ${tags}
draft: false
description: ${description}
---`;

  // Return the complete note with frontmatter, summary, tags and original content
  tR = `${frontmatter}

${formattedSummary}

---

${mainContent}`;
} else {
  // If there's no content yet, just create an empty note with base frontmatter
  tR = `---
title: ${tp.file.title}
date: ${tp.date.now("YYYY-MM-DD")}
tags: 
draft: false
description: 
---

`;
}
%>

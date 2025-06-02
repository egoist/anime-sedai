export type Language = 'zh' | 'en'

export const translations = {
  zh: {
    title: '动画世代',
    subtitle: '点击选择你看过的动画',
    website: 'anime-sedai.egoist.dev',
    watchedCount: '我看过 {{count}}/{{total}} 部动画',
    selectAll: '全选',
    clear: '清除',
    copyImage: '复制图片',
    downloadImage: '下载图片',
    copySuccess: '复制成功',
    downloadSuccess: '下载成功',
    copyFailed: '复制失败: {{error}}',
    downloadFailed: '下载失败: {{error}}',
    copying: '复制中',
    downloading: '下载中',
    unknownError: '未知错误',
    promptType: '锐评提示词',
    promptNormal: '普通',
    promptZako: '杂鱼❤',
    copy: '复制',
    openInChatWise: '在 ChatWise 中打开 (需要先安装)',
    footer: '历年关注最多的动画，数据来自 bgm.tv，由',
    madeBy: '制作，',
    viewCode: '查看代码',
    otherProducts: '作者的其它产品: ',
    aiChatClient: ', 一个优雅的 AI 聊天客户端',
    year: '年',
    watched: '看过',
    notWatched: '没看过',
    none: '无',
    language: '语言',
    chinese: '中文',
    english: 'English'
  },
  en: {
    title: 'Anime Sedai',
    subtitle: 'Click to select anime you have watched',
    website: 'anime-sedai.egoist.dev',
    watchedCount: 'I have watched {{count}}/{{total}} anime',
    selectAll: 'Select All',
    clear: 'Clear',
    copyImage: 'Copy Image',
    downloadImage: 'Download Image',
    copySuccess: 'Copy successful',
    downloadSuccess: 'Download successful',
    copyFailed: 'Copy failed: {{error}}',
    downloadFailed: 'Download failed: {{error}}',
    copying: 'Copying',
    downloading: 'Downloading',
    unknownError: 'Unknown error',
    promptType: 'Review Prompt',
    promptNormal: 'Normal',
    promptZako: 'Zako❤',
    copy: 'Copy',
    openInChatWise: 'Open in ChatWise (installation required)',
    footer: 'Most watched anime by year, data from bgm.tv, made by ',
    madeBy: ', ',
    viewCode: 'View Code',
    otherProducts: 'Other products by the author: ',
    aiChatClient: ', an elegant AI chat client',
    year: '',
    watched: 'Watched',
    notWatched: 'Not Watched',
    none: 'None',
    language: 'Language',
    chinese: '中文',
    english: 'English'
  }
}

export const getPromptTemplate = (lang: Language) => {
  if (lang === 'zh') {
    return {
      normal: `以下是用户的动画观看记录，请生成一个锐评。`,
      zako: `你是一个精通二次元文化的傲娇雌小鬼，需要根据用户提供的动画观看记录，用雌小鬼惯用的嘲讽语气混合动画圈梗生成锐评报告。要求：
1. 结构模板
  - 列出5-6个嘲讽段落
  - 每个段落的所有内容请务必都包含在 ">> 标签" 开始的一行之后！！
  - 每一个嘲讽段落的主题都应当不同，且应当尖锐
  - 你应当大量地使用"杂鱼"、"❤"、"杂鱼~"、"杂鱼❤~"，"不会吧不会吧"等雌小鬼常用词汇
  - 不要在输出的报告中写题目以及任何 markdown 样式，这非常，非常重要！！
2. 内容规则
  - 一些常见的梗类型：
    - 冷门番暴露癖（例："看这种没人听的冷门番，大哥哥该不会在等弹幕里出现'同类'吧？杂鱼❤"）
    - 补番速度羞辱（例："三年才看十部？杂鱼哥哥的补番速度比柯南破案还慢呢~"）
    - 类型单一化（例："全是异世界？大哥哥的想象力比史莱姆还黏稠呢~"）
    - 标题长度玩梗（例："《打了300年史莱姆》这种标题...杂鱼哥哥该不会真信能活300年吧？"）
    - 所有内容必须包含在 ">> 标签" 行之后
  - 想一下还有哪些适合用来嘲讽的梗，但不要太多，否则会显得很杂乱
3. 示例:
"""
>> 补番龟速の杂鱼❤  

不会吧不会吧？从2006到2024年只啃了三部动画？杂鱼哥哥的补番速度比吉良吉影的日常还慢呢❤~等你看完新番，人类都移民火星了杂鱼~杂鱼❤~  

>> 冷门番の孤独癖❤  

太空丹迪和异世界舅舅？看这种没人讨论的冷门番，杂鱼哥哥该不会在弹幕里蹲"同类"吧❤~不会真以为自己是宇宙第一鉴赏家吧？杂鱼❤~   

>> 番量贫瘠の杂鱼❤  

三部动画就敢自称阿宅？杂鱼哥哥的番单比史莱姆还稀薄呢❤~不会吧不会吧，该不会把补番当成就系统刷吧？杂鱼❤~杂鱼~

>> ...

...

>> ...

...
"""

现在开始分析用户的动画观看记录，按上述格式输出锐评报告。`
    }
  } else {
    return {
      normal: `The following is the user's anime viewing record, please generate a sharp review.`,
      zako: `You are a proud and arrogant anime otaku girl who needs to generate a sharp review report based on the user's anime viewing record using the sarcastic tone commonly used by tsundere characters mixed with anime culture memes. Requirements:
1. Structure template
  - List 5-6 sarcastic paragraphs
  - All content in each paragraph must be included after a line starting with ">> tag"!!
  - Each sarcastic paragraph should have a different theme and should be sharp
  - You should extensively use terms like "Zako", "❤", "Zako~", "Zako❤~", "No way no way" and other commonly used tsundere vocabulary
  - Do not write titles or any markdown styles in the output report, this is very, very important!!
2. Content rules
  - Some common meme types:
    - Obscure anime exposure fetish (e.g., "Watching such obscure anime that no one talks about, big brother wouldn't be waiting for 'fellow fans' to appear in the comments, would you? Zako❤")
    - Anime watching speed shaming (e.g., "Only ten shows in three years? Big brother's anime completion speed is slower than Conan solving cases~")
    - Type singularity (e.g., "All isekai? Big brother's imagination is stickier than slime~")
    - Title length memes (e.g., "Titles like 'I've Been Killing Slimes for 300 Years'... Zako brother wouldn't really believe you can live 300 years, would you?")
    - All content must be included after ">> tag" lines
  - Think of other suitable memes for sarcasm, but not too many, otherwise it will seem cluttered
3. Example:
"""
>> Turtle-speed anime completion Zako❤  

No way no way? Only watched three anime from 2006 to 2024? Big brother's anime completion speed is slower than Kira Yoshikage's daily routine❤~ By the time you finish watching new anime, humans will have migrated to Mars, Zako~Zako❤~  

>> Obscure anime loner fetish❤  

Space Dandy and Uncle from Another World? Watching such obscure anime that no one discusses, big brother wouldn't be lurking in the comments waiting for "fellow fans", would you❤~ You wouldn't really think you're the universe's number one connoisseur, would you? Zako❤~   

>> Meager anime count Zako❤  

Three anime and you dare call yourself an otaku? Big brother's anime list is thinner than slime❤~ No way no way, you wouldn't treat anime completion like an achievement system, would you? Zako❤~Zako~

>> ...

...

>> ...

...
"""

Now start analyzing the user's anime viewing record and output a sharp review report according to the above format.`
    }
  }
} 
import { load } from "cheerio"
import fs from "fs"

// 2004 to 2026
const years = Array.from({ length: 2026 - 2004 + 1 }, (_, i) => 2004 + i)

type Item = {
  title: string
  score: number
}
const result: Record<string, Item[]> = {}
for (const year of years) {
  console.log(`正在获取 ${year} 年的数据`)
  const url = `https://bgm.tv/anime/browser/tv/airtime/${year}?sort=trends`
  const response = await fetch(url)
  const html = await response.text()
  const $ = load(html)
  const items: Item[] = []
  $(".item").each((_, el) => {
    const title = $(el).find("h3 .l").text().trim()
    const score = Number($(el).find(".rateInfo .fade").text().trim())
    items.push({ title, score })
  })
  result[year] = items
}

fs.writeFileSync("anime.json", JSON.stringify(result, null, 2))

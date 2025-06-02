import { useMemo, useRef, useState, useEffect } from "react"
import animeData, { getAnimeTitle } from "../anime-data"
import { domToBlob } from "modern-screenshot"
import { toast } from "sonner"
import { usePersistState } from "./hooks"
import { useI18n } from "./i18n-context"
import { LanguageToggle } from "./LanguageToggle"
import { getPromptTemplate } from "./i18n"

export const App = () => {
  const { t, language } = useI18n()
  const [selectedAnime, setSelectedAnime] = usePersistState<string[]>(
    "selectedAnime",
    []
  )

  const wrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = t('title')
  }, [language, t])

  const imageToBlob = async () => {
    if (!wrapper.current) return

    const blob = await domToBlob(wrapper.current, {
      scale: 2,
      filter(el) {
        if (el instanceof HTMLElement && el.classList.contains("remove")) {
          return false
        }
        return true
      },
    })

    return blob
  }

  const copyImage = async () => {
    const blob = await imageToBlob()

    if (!blob) return

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ])
  }

  const downloadImage = async () => {
    if (!wrapper.current) return

    const blob = await imageToBlob()

    if (!blob) return

    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "anime-sedai.png"
    a.click()

    URL.revokeObjectURL(url)
  }

  const [promptType, setPromptType] = useState<"normal" | "zako">("zako")
  const prompt = useMemo(() => {
    const templates = getPromptTemplate(language)
    const preset = promptType === "normal" ? templates.normal : templates.zako

    return `
${preset}
${t('watched') === 'Watched' ? 'User anime viewing record: (the year below is the anime release year)' : '用户动画观看记录：(下面的年份是动画发布的年份)'}
${Object.keys(animeData)
  .map((year) => {
    const items = animeData[year] || []

    if (items.length === 0) return ""

    const sliceItems = items.slice(0, 12)
    const watched = sliceItems
      .filter((item) => selectedAnime.includes(getAnimeTitle(item, 'zh')))
      .map((item) => getAnimeTitle(item, language))
      .join(", ")
    const unWatched = sliceItems
      .filter((item) => !selectedAnime.includes(getAnimeTitle(item, 'zh')))
      .map((item) => getAnimeTitle(item, language))
      .join(", ")

    return [
      `**${year}${t('year')}**:`,
      `${t('watched')}: ${watched || t('none')}`,
      `${t('notWatched')}: ${unWatched || t('none')}`,
    ]
      .filter(Boolean)
      .join("\n")
  })
  .filter(Boolean)
  .join("\n")}
    `.trim()
  }, [selectedAnime, promptType, language, t])

  const totalAnime = Object.values(animeData).flatMap((year) => {
    return year.map((item) => getAnimeTitle(item, 'zh')).slice(0, 12)
  }).length

  return (
    <>
      <div className="flex flex-col gap-4 pb-10">
        <div className="p-4 flex flex-col md:items-center">
          <div className="flex justify-end mb-4">
            <LanguageToggle />
          </div>
          <div className="w-full overflow-x-auto">
            <div
              className="flex flex-col border border-b-0 bg-white w-fit mx-auto"
              ref={wrapper}
            >
              <div className="border-b justify-between p-2 text-lg  font-bold flex">
                <h1>
                  {t('title')}<span className="remove"> - {t('subtitle')}</span>
                  <span className="ml-2 text-zinc-400 font-medium">
                    {t('website')}
                  </span>
                </h1>
                <span className="shrink-0 whitespace-nowrap">
                  {t('watchedCount', { count: selectedAnime.length, total: totalAnime })}
                </span>
              </div>
              {Object.keys(animeData).map((year) => {
                const items = animeData[year] || []
                return (
                  <div key={year} className="flex border-b">
                    <div className={`
                      bg-red-500 shrink-0 text-white flex items-center font-bold justify-center p-1 border-black
                      h-16 md:h-20 
                      ${language === 'en' ? 'w-16 md:w-20' : 'w-16 md:w-20'}
                    `}>
                      <span className={`${language === 'en' ? 'text-sm md:text-base' : 'text-base'} text-center`}>
                        {year}
                      </span>
                    </div>
                    <div className="flex shrink-0">
                      {items.slice(0, 12).map((item) => {
                        const animeKey = getAnimeTitle(item, 'zh')
                        const displayTitle = getAnimeTitle(item, language)
                        const isSelected = selectedAnime.includes(animeKey)
                        return (
                          <button
                            key={animeKey}
                            className={`
                              h-16 md:h-20 
                              ${language === 'en' ? 'w-20 md:w-24' : 'w-16 md:w-20'}
                              border-l break-all text-center shrink-0 inline-flex items-center 
                              p-1 overflow-hidden justify-center cursor-pointer 
                              ${language === 'en' ? 'text-xs' : 'text-sm'} 
                              ${isSelected ? "bg-green-500" : "hover:bg-zinc-100"}
                              transition-colors duration-200
                            `}
                            title={displayTitle}
                            onClick={() => {
                              setSelectedAnime((prev) => {
                                if (isSelected) {
                                  return prev.filter(
                                    (title) => title !== animeKey
                                  )
                                }
                                return [...prev, animeKey]
                              })
                            }}
                          >
                            <span className={`leading-tight w-full ${language === 'en' ? 'line-clamp-4' : 'line-clamp-3'}`}>
                              {displayTitle}
                            </span>
                          </button>
                        )
                      })}
                      {Array.from({ length: Math.max(0, 12 - items.length) }, (_, index) => (
                        <div
                          key={`empty-${index}`}
                          className={`
                            h-16 md:h-20 
                            ${language === 'en' ? 'w-20 md:w-24' : 'w-16 md:w-20'}
                            border-l bg-gray-50
                          `}
                        />
                      ))}
                      <div className="w-0 h-16 md:h-20 border-r" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            type="button"
            className="border rounded-md px-4 py-2 inline-flex"
            onClick={() => {
              setSelectedAnime(
                Object.values(animeData).flatMap((year) => {
                  return year.map((item) => getAnimeTitle(item, 'zh')).slice(0, 12)
                })
              )
            }}
          >
            {t('selectAll')}
          </button>

          {selectedAnime.length > 0 && (
            <button
              type="button"
              className="border rounded-md px-4 py-2 inline-flex"
              onClick={() => {
                setSelectedAnime([])
              }}
            >
              {t('clear')}
            </button>
          )}

          <button
            type="button"
            className="border rounded-md px-4 py-2 inline-flex"
            onClick={() => {
              toast.promise(copyImage(), {
                success: t('copySuccess'),
                loading: t('copying'),
                error(error) {
                  return t('copyFailed', { 
                    error: error instanceof Error ? error.message : t('unknownError')
                  })
                },
              })
            }}
          >
            {t('copyImage')}
          </button>

          <button
            type="button"
            className="border rounded-md px-4 py-2 inline-flex"
            onClick={() => {
              toast.promise(downloadImage(), {
                success: t('downloadSuccess'),
                loading: t('downloading'),
                error(error) {
                  return t('downloadFailed', { 
                    error: error instanceof Error ? error.message : t('unknownError')
                  })
                },
              })
            }}
          >
            {t('downloadImage')}
          </button>
        </div>

        <div className="flex flex-col gap-2 max-w-screen-md w-full mx-auto">
          <div className="border focus-within:ring-2 ring-pink-500 focus-within:border-pink-500 rounded-md">
            <div className="flex items-center justify-between p-2 border-b">
              <div className="flex items-center gap-2">
                <span>{t('promptType')}</span>
                <select
                  className="border rounded-md"
                  value={promptType}
                  onChange={(e) => {
                    setPromptType(e.currentTarget.value as any)
                  }}
                >
                  <option value="normal">{t('promptNormal')}</option>
                  <option value="zako">{t('promptZako')}</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="text-sm text-zinc-500 hover:bg-zinc-100 px-1.5 h-7 flex items-center rounded-md"
                  onClick={() => {
                    navigator.clipboard.writeText(prompt)
                    toast.success(t('copySuccess'))
                  }}
                >
                  {t('copy')}
                </button>

                <button
                  type="button"
                  className="text-sm text-zinc-500 hover:bg-zinc-100 px-1.5 h-7 flex items-center rounded-md"
                  onClick={() => {
                    location.href = `chatwise://chat?input=${encodeURIComponent(
                      prompt
                    )}`
                  }}
                >
                  {t('openInChatWise')}
                </button>
              </div>
            </div>
            <textarea
              readOnly
              className="outline-none w-full p-2 resize-none cursor-default"
              rows={10}
              value={prompt}
            />
          </div>
        </div>

        <div className="mt-2 text-center">
          {t('footer')}
          <a
            href={language === 'zh' ? "https://x.com/localhost_4173" : "https://x.com/localhost_5173"}
            target="_blank"
            className="underline"
          >
            {language === 'zh' ? '低空飞行' : 'egoist'}
          </a>
          {t('madeBy')}
          <a
            href="https://github.com/egoist/anime-sedai"
            target="_blank"
            className="underline"
          >
            {t('viewCode')}
          </a>
        </div>

        {language === 'en' && (
          <div className="text-center text-sm text-gray-600">
            English version is translated by{' '}
            <a
              href="https://mhh0318.github.io/"
              target="_blank"
              className="underline"
            >
             h1t
            </a>
          </div>
        )}

        <div className="text-center">
          {t('otherProducts')}
          <a
            href="https://chatwise.app"
            target="_blank"
            className="underline inline-flex items-center gap-1"
          >
            <img src="https://chatwise.app/favicon.png" className="size-4" />{" "}
            ChatWise
          </a>
          {t('aiChatClient')}
        </div>
      </div>
    </>
  )
}

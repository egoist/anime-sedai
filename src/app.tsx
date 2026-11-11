import { useMemo, useRef, useEffect } from "react"
import animeData, { getAnimeTitle } from "../anime-data"
import { domToBlob } from "modern-screenshot"
import { toast } from "sonner"
import { usePersistState } from "./hooks"
import { useI18n } from "./i18n-context"
import { LanguageToggle } from "./LanguageToggle"

type YearRange = "5" | "10" | "15" | "all"

const yearRangeOptions: YearRange[] = ["5", "10", "15", "all"]
const allYears = Object.keys(animeData).sort((a, b) => Number(a) - Number(b))

export const App = () => {
  const { t, language } = useI18n()
  const [selectedAnime, setSelectedAnime] = usePersistState<string[]>(
    "selectedAnime",
    []
  )
  const [yearRange, setYearRange] = usePersistState<YearRange>(
    "yearRange",
    "all"
  )

  const visibleYears = useMemo(() => {
    if (yearRange === "all") {
      return allYears
    }

    return allYears.slice(-Number(yearRange))
  }, [yearRange])

  const visibleAnimeKeys = useMemo(() => {
    return visibleYears.flatMap((year) => {
      const items = animeData[year] || []
      return items.slice(0, 12).map((item) => getAnimeTitle(item, "zh"))
    })
  }, [visibleYears])

  const visibleAnimeKeySet = useMemo(() => {
    return new Set(visibleAnimeKeys)
  }, [visibleAnimeKeys])

  const selectedVisibleAnimeCount = selectedAnime.filter((title) => {
    return visibleAnimeKeySet.has(title)
  }).length

  const getYearRangeLabel = (option: YearRange) => {
    switch (option) {
      case "5":
        return t("last5Years")
      case "10":
        return t("last10Years")
      case "15":
        return t("last15Years")
      case "all":
        return t("allYears")
    }
  }

  const wrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = t("title")
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

  const totalAnime = visibleAnimeKeys.length

  return (
    <>
      <div className="flex flex-col gap-4 pb-10">
        <div className="p-4 flex flex-col md:items-center">
          <div className="flex w-full flex-col gap-2 mb-4 md:flex-row md:items-center md:justify-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t("yearRange")}:</span>
              <select
                className="border rounded px-2 py-1 text-sm bg-white"
                value={yearRange}
                onChange={(e) => {
                  setYearRange(e.currentTarget.value as YearRange)
                }}
              >
                {yearRangeOptions.map((option) => (
                  <option key={option} value={option}>
                    {getYearRangeLabel(option)}
                  </option>
                ))}
              </select>
            </div>
            <LanguageToggle />
          </div>
          <div className="w-full overflow-x-auto">
            <div
              className="flex flex-col border border-b-0 bg-white w-fit mx-auto"
              ref={wrapper}
            >
              <div className="border-b justify-between p-2 text-lg  font-bold flex">
                <h1>
                  {t("title")}
                  <span className="remove"> - {t("subtitle")}</span>
                  <span className="ml-2 text-zinc-400 font-medium">
                    {t("website")}
                  </span>
                </h1>
                <span className="shrink-0 whitespace-nowrap">
                  {t("watchedCount", {
                    count: selectedVisibleAnimeCount,
                    total: totalAnime,
                  })}
                </span>
              </div>
              {visibleYears.map((year) => {
                const items = animeData[year] || []
                return (
                  <div key={year} className="flex border-b">
                    <div
                      className={`
                      bg-red-500 shrink-0 text-white flex items-center font-bold justify-center p-1 border-black
                      h-16 md:h-20 
                      ${language === "en" ? "w-16 md:w-20" : "w-16 md:w-20"}
                    `}
                    >
                      <span
                        className={`${
                          language === "en"
                            ? "text-sm md:text-base"
                            : "text-base"
                        } text-center`}
                      >
                        {year}
                      </span>
                    </div>
                    <div className="flex shrink-0">
                      {items.slice(0, 12).map((item) => {
                        const animeKey = getAnimeTitle(item, "zh")
                        const displayTitle = getAnimeTitle(item, language)
                        const isSelected = selectedAnime.includes(animeKey)
                        return (
                          <button
                            key={animeKey}
                            className={`
                              h-16 md:h-20 
                              ${
                                language === "en"
                                  ? "w-20 md:w-24"
                                  : "w-16 md:w-20"
                              }
                              border-l break-words text-center shrink-0 inline-flex items-center 
                              p-1 overflow-hidden justify-center cursor-pointer 
                              ${language === "en" ? "text-xs" : "text-sm"} 
                              ${
                                isSelected
                                  ? "bg-green-500"
                                  : "hover:bg-zinc-100"
                              }
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
                            <span
                              className={`leading-tight w-full ${
                                language === "en"
                                  ? "line-clamp-4"
                                  : "line-clamp-3"
                              }`}
                            >
                              {displayTitle}
                            </span>
                          </button>
                        )
                      })}
                      {Array.from(
                        { length: Math.max(0, 12 - items.length) },
                        (_, index) => (
                          <div
                            key={`empty-${index}`}
                            className={`
                            h-16 md:h-20 
                            ${
                              language === "en"
                                ? "w-20 md:w-24"
                                : "w-16 md:w-20"
                            }
                            border-l bg-gray-50
                          `}
                          />
                        )
                      )}
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
              setSelectedAnime((prev) => {
                const hiddenSelectedAnime = prev.filter((title) => {
                  return !visibleAnimeKeySet.has(title)
                })

                return [...hiddenSelectedAnime, ...visibleAnimeKeys]
              })
            }}
          >
            {t("selectAll")}
          </button>

          {selectedVisibleAnimeCount > 0 && (
            <button
              type="button"
              className="border rounded-md px-4 py-2 inline-flex"
              onClick={() => {
                setSelectedAnime((prev) => {
                  return prev.filter((title) => !visibleAnimeKeySet.has(title))
                })
              }}
            >
              {t("clear")}
            </button>
          )}

          <button
            type="button"
            className="border rounded-md px-4 py-2 inline-flex"
            onClick={() => {
              toast.promise(copyImage(), {
                success: t("copySuccess"),
                loading: t("copying"),
                error(error) {
                  return t("copyFailed", {
                    error:
                      error instanceof Error
                        ? error.message
                        : t("unknownError"),
                  })
                },
              })
            }}
          >
            {t("copyImage")}
          </button>

          <button
            type="button"
            className="border rounded-md px-4 py-2 inline-flex"
            onClick={() => {
              toast.promise(downloadImage(), {
                success: t("downloadSuccess"),
                loading: t("downloading"),
                error(error) {
                  return t("downloadFailed", {
                    error:
                      error instanceof Error
                        ? error.message
                        : t("unknownError"),
                  })
                },
              })
            }}
          >
            {t("downloadImage")}
          </button>
        </div>

        <div className="mt-2 text-center">
          {t("footer")}
          <a
            href={
              language === "zh"
                ? "https://x.com/localhost_4173"
                : "https://x.com/localhost_5173"
            }
            target="_blank"
            className="underline"
          >
            {language === "zh" ? "低空飞行" : "egoist"}
          </a>
          {t("madeBy")}
          <a
            href="https://github.com/egoist/anime-sedai"
            target="_blank"
            className="underline"
          >
            {t("viewCode")}
          </a>
        </div>

        {language === "en" && (
          <div className="text-center text-sm text-gray-600">
            English version is translated by{" "}
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
          {t("otherProducts")}
          <div>
            <a
              href="https://downbit.app"
              target="_blank"
              className="underline inline-flex items-center gap-1"
            >
              <img src="https://downbit.app/favicon.png" className="size-4" />{" "}
              Downbit
            </a>
            {t("downbitDesc")}
          </div>
          <div>
            <a
              href="https://screenflare.app"
              target="_blank"
              className="underline inline-flex items-center gap-1"
            >
              <img src="https://screenflare.app/app-icon.png" className="size-4" />{" "}
              Screenflare
            </a>
            {t("screenflareDesc")}
          </div>
        </div>
      </div>
    </>
  )
}

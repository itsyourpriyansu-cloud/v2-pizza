"use client"

import React, { useRef } from "react"
import { cn } from "@/lib/utils"
import { useMotionValueEvent, useScroll } from "motion/react"

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  width?: number | string
  height?: number | string
}

const Image = ({ src, alt, width, height, className, ...props }: ImageProps) => (
  <img src={src} alt={alt} width={width} height={height} className={className} loading="lazy" {...props} />
)

export const centralColumnStyle = "w-full max-w-[1340px] mx-auto"
export const pageYPadding = "py-10 md:py-12 lg:py-16"
const defaultTitleClass = "text-2xl md:text-3xl font-semibold mb-2 text-foreground"
const defaultDescriptionClass = "text-base md:text-lg font-medium mb-2 text-foreground max-w-[480px] leading-[140%]"

export interface ItemContent {
  title: string
  description: string
  image: {
    url: string
    width: number
    height: number
    alt: string
  }
}

interface Props extends React.ComponentProps<"div"> {
  contentA: ItemContent
  contentB: ItemContent
  contentC: ItemContent
  titleClass?: string
  descriptionClass?: string
}

const ScrollRevealContentA = ({
  contentA,
  contentB,
  contentC,
  titleClass = defaultTitleClass,
  descriptionClass = defaultDescriptionClass,
  className,
  ...props
}: Props) => {
  const [scrollProgress, setScrollProgress] = React.useState(0)
  const ref0 = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref0,
  })
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest)
  })

  return (
    <div className={cn("bg-background story-reveal-root", className)} ref={ref0} {...props}>
      <div className="story-reveal-wrapper">
        <div className="story-reveal-track">
          <div className={cn(centralColumnStyle, "story-reveal-sticky")}>
            <div className="story-reveal-columns">
              <div className="story-reveal-text-col">
                <PointItem
                  active={true}
                  number="01"
                  title={contentA.title}
                  description={contentA.description}
                  thresholdStart={0}
                  thresholdEnd={0.33}
                  scrollProgress={scrollProgress}
                  titleClass={titleClass}
                  descriptionClass={descriptionClass}
                />
                <PointItem
                  active={true}
                  number="02"
                  title={contentB.title}
                  description={contentB.description}
                  thresholdStart={0.33}
                  thresholdEnd={0.66}
                  scrollProgress={scrollProgress}
                  titleClass={titleClass}
                  descriptionClass={descriptionClass}
                />
                <PointItem
                  active={true}
                  number="03"
                  title={contentC.title}
                  description={contentC.description}
                  thresholdStart={0.66}
                  thresholdEnd={1}
                  scrollProgress={scrollProgress}
                  titleClass={titleClass}
                  descriptionClass={descriptionClass}
                />
              </div>

              <div className="story-reveal-media-col">
                <div className="story-reveal-stage">
                  <Image
                    width={contentA.image.width}
                    height={contentA.image.height}
                    src={contentA.image.url}
                    alt={contentA.image.alt}
                    className={cn(
                      "story-reveal-image",
                      scrollProgress <= 0.33 ? "opacity-100 is-active" : "opacity-0 is-hidden"
                    )}
                  />
                  <Image
                    width={contentB.image.width}
                    height={contentB.image.height}
                    src={contentB.image.url}
                    alt={contentB.image.alt}
                    className={cn(
                      "story-reveal-image",
                      scrollProgress > 0.33 && scrollProgress <= 0.66 ? "opacity-100 is-active" : "opacity-0 is-hidden"
                    )}
                  />
                  <Image
                    width={contentC.image.width}
                    height={contentC.image.height}
                    src={contentC.image.url}
                    alt={contentC.image.alt}
                    className={cn(
                      "story-reveal-image",
                      scrollProgress > 0.66 ? "opacity-100 is-active" : "opacity-0 is-hidden"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="story-reveal-spacer" />
        </div>
      </div>
    </div>
  )
}

export default ScrollRevealContentA

const getBarPercentageHeight = (scrollProgress: number, thresholdStart: number, thresholdEnd: number) => {
  if (scrollProgress < thresholdStart) {
    return 0
  }
  if (scrollProgress > thresholdEnd) {
    return 100
  }
  return ((scrollProgress - thresholdStart) / (thresholdEnd - thresholdStart)) * 100
}

const PointItem = ({
  active,
  number,
  title,
  description,
  thresholdStart,
  thresholdEnd,
  scrollProgress,
  titleClass = defaultTitleClass,
  descriptionClass = defaultDescriptionClass,
}: {
  active: boolean
  number: string
  title: string
  description: string
  thresholdStart: number
  thresholdEnd: number
  scrollProgress: number
  titleClass?: string
  descriptionClass?: string
}) => {
  const barHeightPercentage = getBarPercentageHeight(scrollProgress, thresholdStart, thresholdEnd)
  const isCurrentActive = scrollProgress >= thresholdStart && scrollProgress <= thresholdEnd
  const isCompleted = scrollProgress > thresholdEnd
  const isHighlighted = isCurrentActive || isCompleted

  return (
    <div
      className={cn(
        "story-point-item",
        active ? "opacity-100" : "opacity-50",
        isCurrentActive ? "is-current" : isCompleted ? "is-done" : "is-upcoming"
      )}
    >
      <div className="story-point-number-row">
        <span className={cn("story-point-number", isHighlighted ? "opacity-100 text-maroon" : "opacity-50")}>
          {number}
        </span>
      </div>
      <div className="story-point-body">
        <div className="story-point-bar-track">
          <div className="story-point-bar-bg" />
          <div
            className="story-point-bar-fill"
            style={{ height: `${barHeightPercentage}%` }}
          />
        </div>
        <div className="story-point-text">
          <h3 className={cn(titleClass, isHighlighted ? "opacity-100" : "opacity-60")}>
            {title}
          </h3>
          <p className={cn(descriptionClass, isHighlighted ? "opacity-100" : "opacity-60")}>
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

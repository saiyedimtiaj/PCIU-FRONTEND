
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaLinkedinIn, FaFacebookF, FaXTwitter } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { getVCInfo } from "@/lib/api/home";
import { getMediaUrl } from "@/lib/utils/media";

export default async function VCMessage() {
  const vc = await getVCInfo();

  if (!vc) return null;

  const photoUrl = getMediaUrl(vc.imageUrl);

  const socialLinks = [
    {
      url: vc.linkedinUrl,
      icon: FaLinkedinIn,
      label: "LinkedIn",
    },
    {
      url: vc.facebookUrl,
      icon: FaFacebookF,
      label: "Facebook",
    },
    {
      url: vc.twitterUrl,
      icon: FaXTwitter,
      label: "X",
    },
  ].filter(
    (
      link,
    ): link is {
      url: string;
      icon: typeof FaLinkedinIn;
      label: string;
    } => Boolean(link.url),
  );

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-18 md:py-22 lg:py-28">
      {/* =========================================================
          BACKGROUND DECORATION
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft blue glow - left */}
        <div
          className="
            absolute
            -left-40
            top-20
            h-80
            w-80
            rounded-full
            bg-blue-50
            blur-3xl
            opacity-70
          "
        />

        {/* Soft gold glow - bottom right */}
        <div
          className="
            absolute
            -right-40
            bottom-[-120px]
            h-[420px]
            w-[420px]
            rounded-full
            bg-amber-50
            blur-3xl
            opacity-60
          "
        />

        {/* =====================================================
            FLOWING CURVED LINES
            Screenshot-এর bottom-right design
        ====================================================== */}

        <div
          className="
            absolute
            bottom-[-15px]
            right-[-120px]
            h-[360px]
            w-[760px]
            sm:h-[430px]
            sm:w-[850px]
            lg:h-[500px]
            lg:w-[950px]
          "
        >
          <svg
            viewBox="0 0 950 500"
            className="h-full w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Blue line fade */}
              <linearGradient id="blueWave" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#DCEAF8" stopOpacity="0" />
                <stop offset="45%" stopColor="#C9DDF2" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#AFCBE8" stopOpacity="0.9" />
              </linearGradient>

              {/* Gold line fade */}
              <linearGradient id="goldWave" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F3E4B8" stopOpacity="0" />
                <stop offset="55%" stopColor="#E6C96D" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#D99A00" stopOpacity="0.55" />
              </linearGradient>
            </defs>

            {/* =================================================
                MAIN BLUE FLOW
            ================================================== */}

            <path
              d="
                M -80 455
                C 150 350, 300 430, 470 350
                C 650 265, 710 250, 1020 40
              "
              stroke="url(#blueWave)"
              strokeWidth="1.4"
            />

            <path
              d="
                M -80 470
                C 150 365, 310 445, 480 365
                C 660 280, 730 255, 1020 55
              "
              stroke="url(#blueWave)"
              strokeWidth="1.2"
            />

            <path
              d="
                M -80 485
                C 145 380, 315 460, 490 380
                C 675 295, 750 270, 1020 72
              "
              stroke="url(#blueWave)"
              strokeWidth="1.15"
            />

            <path
              d="
                M -70 500
                C 150 395, 320 475, 500 395
                C 690 310, 765 285, 1020 90
              "
              stroke="url(#blueWave)"
              strokeWidth="1"
            />

            <path
              d="
                M -50 515
                C 160 410, 330 490, 510 410
                C 705 325, 780 300, 1020 108
              "
              stroke="url(#blueWave)"
              strokeWidth="1"
            />

            <path
              d="
                M -20 525
                C 170 420, 345 500, 525 425
                C 720 340, 795 315, 1020 125
              "
              stroke="url(#blueWave)"
              strokeWidth="0.9"
            />

            <path
              d="
                M 10 535
                C 185 430, 355 510, 540 440
                C 735 355, 815 330, 1020 143
              "
              stroke="url(#blueWave)"
              strokeWidth="0.9"
            />

            <path
              d="
                M 45 545
                C 200 440, 370 520, 555 455
                C 750 370, 830 345, 1020 160
              "
              stroke="url(#blueWave)"
              strokeWidth="0.85"
            />

            {/* =================================================
                GOLD FLOWING LINES
            ================================================== */}

            <path
              d="
                M 130 535
                C 300 450, 410 505, 570 445
                C 750 378, 830 350, 1020 190
              "
              stroke="url(#goldWave)"
              strokeWidth="1"
            />

            <path
              d="
                M 175 540
                C 330 465, 430 515, 590 460
                C 770 395, 850 365, 1020 205
              "
              stroke="url(#goldWave)"
              strokeWidth="0.9"
            />

            <path
              d="
                M 220 545
                C 360 480, 450 525, 610 475
                C 790 410, 870 380, 1020 220
              "
              stroke="url(#goldWave)"
              strokeWidth="0.85"
            />

            <path
              d="
                M 270 550
                C 390 495, 470 535, 630 490
                C 805 425, 890 395, 1020 235
              "
              stroke="url(#goldWave)"
              strokeWidth="0.75"
            />

            {/* =================================================
                EXTRA FINE BLUE LINES
            ================================================== */}

            <path
              d="
                M 90 500
                C 250 420, 350 470, 530 390
                C 710 310, 780 275, 1020 105
              "
              stroke="#E5EFF9"
              strokeWidth="0.7"
            />

            <path
              d="
                M 110 515
                C 265 435, 365 485, 545 405
                C 725 325, 800 290, 1020 120
              "
              stroke="#E9F2FA"
              strokeWidth="0.7"
            />

            <path
              d="
                M 150 525
                C 285 445, 385 495, 560 420
                C 740 340, 820 305, 1020 135
              "
              stroke="#EDF4FA"
              strokeWidth="0.65"
            />
          </svg>
        </div>

        {/* =====================================================
            VERY SUBTLE BOTTOM GRID / LIGHT CURVE
        ====================================================== */}

        <div
          className="
            absolute
            bottom-0
            right-0
            h-40
            w-[55%]
            bg-gradient-to-t
            from-blue-50/20
            to-transparent
          "
        />
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="
            mx-auto
            grid
            max-w-6xl
            items-center
            grid-cols-1
            gap-12
            md:grid-cols-[minmax(280px,360px)_1fr]
            md:gap-14
            lg:grid-cols-[390px_1fr]
            lg:gap-20
          "
        >
          {/* =====================================================
              VC PROFILE
          ====================================================== */}

          <div className="relative mx-auto w-full max-w-[390px] ">
            {/* Decorative back panel */}
            <div
              className="
                absolute
                -left-4
                -top-4
                h-[calc(100%-25px)]
                w-[calc(100%-20px)]
                rounded-[28px]
                bg-[#EEF5FC]
                sm:-left-5
                sm:-top-5
              "
            />

            {/* Main card */}
            <div
              className="
                relative
                rounded-[26px]
                bg-white
                p-3
                shadow-[0_25px_70px_rgba(8,47,103,0.13)]
                sm:p-4
              "
            >
              {/* Gold corner - top right */}
              <div
                className="
                  absolute
                  right-5
                  top-5
                  z-20
                  h-20
                  w-20
                  rounded-tr-2xl
                  border-r-2
                  border-t-2
                  border-[#D99A00]
                "
              />

              {/* Gold corner - bottom left */}
              <div
                className="
                  absolute
                  bottom-[105px]
                  left-5
                  z-20
                  h-16
                  w-16
                  rounded-bl-2xl
                  border-b-2
                  border-l-2
                  border-[#D99A00]
                  sm:bottom-[115px]
                "
              />

              {/* Photo */}
             <div className="group relative aspect-[5/4] overflow-hidden rounded-[21px] bg-[#EEF5FC]">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={`${vc.name} - ${vc.designation ?? "Vice Chancellor"}`}
                    fill
                    priority
                    sizes="
                      (min-width: 1024px) 360px,
                      (min-width: 768px) 330px,
                      90vw
                    "
                    className="
                      object-cover
                      object-top
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-[1.035]
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      items-center
                      justify-center
                      px-5
                      text-center
                      text-sm
                      text-slate-400
                    "
                  >
                    Photo unavailable
                  </div>
                )}

                {/* Subtle image overlay */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#082F67]/15
                    via-transparent
                    to-transparent
                  "
                />
              </div>

              {/* =================================================
                  NAME / DESIGNATION
              ================================================== */}

              <div
                className="
                  relative
                  z-30
                  -mt-2
                  mx-2
                  rounded-2xl
                  bg-white
                  px-4
                  py-4
                  text-center
                  shadow-[0_12px_35px_rgba(8,47,103,0.13)]
                  sm:mx-4
                  sm:px-5
                "
              >
                <h3
                  className="
                    font-heading
                    text-base
                    font-bold
                    leading-snug
                    text-[#082F67]
                    sm:text-lg
                  "
                >
                  {vc.name}
                </h3>

                {vc.designation && (
                  <p
                    className="
                      mt-1
                      text-xs
                      font-medium
                      tracking-wide
                      text-[#D99A00]
                      sm:text-sm
                    "
                  >
                    {vc.designation}
                  </p>
                )}
              </div>

              {/* =================================================
                  SOCIAL LINKS
              ================================================== */}

              {socialLinks.length > 0 && (
                <div
                  className="
                    relative
                    z-30
                    flex
                    justify-center
                    gap-3
                    pt-5
                    sm:gap-4
                    sm:pt-6
                  "
                >
                  {socialLinks.map(({ url, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${vc.name} on ${label}`}
                      className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-slate-200
                          bg-white
                          text-[#0A4A94]
                          shadow-sm
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:border-[#0A4A94]
                          hover:bg-[#0A4A94]
                          hover:text-white
                          hover:shadow-lg
                          sm:h-11
                          sm:w-11
                        "
                    >
                      <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* =====================================================
              MESSAGE CONTENT
          ====================================================== */}

          <div className="relative text-center md:text-left">
            {/* Eyebrow */}
            <div
              className="
                mb-5
                flex
                items-center
                justify-center
                gap-3
                md:justify-start
              "
            >
              <span className="h-[2px] w-8 bg-[#D99A00]" />

              <span
                className="
                  text-[12px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#C58900]
                  sm:text-xs
                "
              >
                From the Vice Chancellor
              </span>
            </div>

            {/* Main heading */}
            <h2
              className="
                mx-auto
                max-w-3xl
                font-heading
                text-[24px]
                font-bold
                leading-[1.08]
                tracking-tight
                text-[#082F67]
                sm:text-[32px]
                md:mx-0
                md:text-[32px]
                lg:text-[32px]
                xl:text-[36px]
              "
            >
              A university built to change
              <span className="block">the society it serves</span>
            </h2>

            {/* Accent */}
            <div
              className="
                mx-auto
                my-6
                h-[3px]
                w-12
                rounded-full
                bg-[#D99A00]
                md:mx-0
              "
            />

            {/* Dynamic VC message */}
            {vc.shortBio && (
              <p
                className="
                  mx-auto
                  max-w-2xl
                  text-sm
                  leading-7
                  text-slate-600
                  sm:text-base
                  sm:leading-8
                  md:mx-0
                  md:text-lg
                  md:leading-9
                "
              >
                {vc.shortBio}
              </p>
            )}

            {/* Read Full Message */}

            <div className="mt-9 sm:mt-10">
              <Link
                href="/vice-chancellors-message"
                className="
      group
      inline-flex
      items-center
      gap-3
      rounded-full
      border
      border-[#D99A00]/40
      bg-white/80
      py-1.5
      pl-5
      pr-1.5
      shadow-[0_6px_20px_rgba(8,47,103,0.06)]
      backdrop-blur-sm
      transition-all
      duration-300
      hover:-translate-y-0.5
      hover:border-[#082F67]
      hover:bg-white
      hover:shadow-[0_10px_28px_rgba(8,47,103,0.14)]
    "
              >
                {/* Text */}
                <span
                  className="
        font-heading
        text-sm
        font-semibold
        tracking-wide
        text-[#082F67]
        transition-colors
        duration-300
        group-hover:text-[#082F67]
        sm:text-base
      "
                >
                  Read Full Message
                </span>

                {/* Circular Arrow */}
                <span
                  className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        bg-[#D99A00]
        text-white
        shadow-[0_4px_12px_rgba(217,154,0,0.25)]
        transition-all
        duration-300
        group-hover:bg-[#082F67]
        group-hover:shadow-[0_5px_16px_rgba(8,47,103,0.25)]
      "
                >
                  <ArrowRight
                    className="
          size-4
          transition-transform
          duration-300
          group-hover:translate-x-0.5
        "
                  />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

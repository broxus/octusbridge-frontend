import { uniqueKey } from '@broxus/js-utils'
import * as React from 'react'

function getSize(height: number, width: number, ratio: number = 1) {
    return {
        height: height * ratio,
        width: width * ratio,
    }
}

export const defaultProps = {
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
}

type Props = {
    ratio?: number
}

function t<V extends React.ElementType<Props>, T extends { [key in string]: V }>(obj: T): T {
    return obj
}

/* eslint-disable */
const library = t({
    tvm1BlockchainIcon: ({ ratio, ...props }) => {
        const gradientId = uniqueKey(7, 'tvm1')
        return (
            <svg {...defaultProps} {...props} viewBox="0 0 600 600" {...getSize(20, 20, ratio)}>
                <path
                    d="M300 600C465.685 600 600 465.685 600 300C600 134.315 465.685 0 300 0C134.315 0 0 134.315 0 300C0 465.685 134.315 600 300 600Z"
                    fill={`url(#${gradientId})`}
                    className="uk-preserve"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M322.598 505L445 383.512V155H216.488L95 277.5H322.5L322.598 505Z"
                    fill="#fff"
                    className="uk-preserve"
                />
                <defs>
                    <linearGradient
                        id={gradientId}
                        x1={600}
                        y1={0.000226805}
                        x2={54.5601}
                        y2={541.13}
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#FF6922" />
                        <stop offset={1} stopColor="#6347F5" />
                    </linearGradient>
                </defs>
            </svg>
        )
    },
    tvm42BlockchainIcon: ({ ratio, ...props }) => {
        const gradientId = uniqueKey(7, 'tvm42')
        return (
            <svg {...defaultProps} {...props} viewBox="0 0 600 600" {...getSize(20, 20, ratio)}>
                <path
                    d="M300 600C465.685 600 600 465.685 600 300C600 134.315 465.685 0 300 0C134.315 0 0 134.315 0 300C0 465.685 134.315 600 300 600Z"
                    fill={`url(#${gradientId})`}
                    className="uk-preserve"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M322.598 505L445 383.512V155H216.488L95 277.5H322.5L322.598 505Z"
                    fill="#fff"
                    className="uk-preserve"
                />
                <defs>
                    <linearGradient
                        id={gradientId}
                        x1={600}
                        y1={0.000226805}
                        x2={54.5601}
                        y2={541.13}
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#FF6922" />
                        <stop offset={1} stopColor="#6347F5" />
                    </linearGradient>
                </defs>
            </svg>
        )
    },
    tvm1000BlockchainIcon: ({ ratio, ...props }) => {
        const maskId = uniqueKey()
        const gradient1Id = uniqueKey()
        const gradient2Id = uniqueKey()
        const gradient3Id = uniqueKey()
        const gradient4Id = uniqueKey()
        const gradient5Id = uniqueKey()
        const gradient6Id = uniqueKey()
        return (
            <svg {...defaultProps} {...props} viewBox="0 0 32 32" {...getSize(20, 20, ratio)}>
                <circle className="uk-preserve" cx={16} cy={16} r={16} fill={`url(#${gradient1Id})`} />
                <mask
                    id={maskId}
                    style={{ maskType: 'alpha' }}
                    maskUnits="userSpaceOnUse"
                    x={0}
                    y={0}
                    width={32}
                    height={32}
                >
                    <circle className="uk-preserve" cx={16} cy={16} r={16} fill={`url(#${gradient2Id})`} />
                </mask>
                <g mask={`url(#${maskId})`}>
                    <g filter={`url(#${gradient5Id})`}>
                        <path
                            className="uk-preserve"
                            d="M7.84 5.762c8.1-1.384 16.821 3.77 19.481 11.51 2.66 7.741-1.75 15.138-9.849 16.522-8.099 1.383-16.82-3.77-19.48-11.511S-.258 7.145 7.84 5.762Z"
                            fill={`url(#${gradient3Id})`}
                        />
                    </g>
                    <g filter={`url(#${gradient6Id}})`}>
                        <path
                            className="uk-preserve"
                            d="M27.178 22.05c-6.322 5.248-16.452 5.145-22.625-.229-6.174-5.373-6.054-13.984.269-19.232 6.322-5.247 16.452-5.145 22.625.229 6.174 5.374 6.054 13.984-.268 19.232Z"
                            fill={`url(#${gradient4Id})`}
                        />
                    </g>
                </g>
                <path
                    className="uk-preserve"
                    d="M23.117 6.044a3.647 3.647 0 0 0-1.714.147 3.49 3.49 0 0 0-1.43.91c-.742.79-.973 1.819-.795 2.85.162.929.376 1.872.424 2.767a9.704 9.704 0 0 1-.636 3.965c-.44 1.148-1.068 2.038-2.412 2.235-.1.015-.463.025-.566.03a4.633 4.633 0 0 1-.53-.029c-1.345-.197-1.978-1.087-2.418-2.242a9.706 9.706 0 0 1-.635-3.965c.048-.892.262-1.836.424-2.768.178-1.03-.053-2.06-.795-2.85a3.492 3.492 0 0 0-1.434-.908 3.647 3.647 0 0 0-1.716-.142C7.159 6.311 6.01 7.766 6 9.291a3.039 3.039 0 0 0 .485 1.668c.537.84 1.418 1.454 2.187 2.09.509.426 1.388 1.635 1.82 2.944.26.793.474 1.597.685 2.408.295 1.131.702 3.629.97 4.763.535 2.27 2.17 2.784 3.81 2.836h.059c1.64-.052 3.302-.567 3.837-2.837.267-1.134.672-3.633.97-4.762.212-.808.424-1.616.685-2.409.432-1.31 1.311-2.522 1.82-2.944.769-.638 1.649-1.25 2.187-2.09A3.04 3.04 0 0 0 26 9.29c-.01-1.529-1.153-2.984-2.883-3.246Z"
                    fill="#fff"
                />
                <defs>
                    <linearGradient
                        id={gradient1Id}
                        x1="2.609"
                        y1="4.348"
                        x2="26.435"
                        y2="28.87"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#649A66" />
                        <stop offset={1} stopColor="#2B4CCF" />
                    </linearGradient>
                    <linearGradient
                        id={gradient2Id}
                        x1="2.609"
                        y1="4.348"
                        x2="26.435"
                        y2="28.87"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#649A66" />
                        <stop offset={1} stopColor="#2B4CCF" />
                    </linearGradient>
                    <linearGradient
                        id={gradient3Id}
                        x1="8.64"
                        y1="32.48"
                        x2="12.754"
                        y2="20.464"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#8FEBFF" />
                        <stop offset={1} stopColor="#2B4CCF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                        id={gradient4Id}
                        x1="14.431"
                        y1="1.402"
                        x2="14.179"
                        y2="26.309"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#49F150" />
                        <stop offset={1} stopColor="#2B4CCF" stopOpacity={0} />
                    </linearGradient>
                    <filter
                        id={gradient5Id}
                        x="-12.783"
                        y="-4.463"
                        width="50.879"
                        height="48.481"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood floodOpacity={0} result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="5" result="effect1_foregroundBlur_10890_5345" />
                    </filter>
                    <filter
                        id={gradient6Id}
                        x="-10"
                        y="-11.28"
                        width="52"
                        height="47.2"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood floodOpacity={0} result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="5" result="effect1_foregroundBlur_10890_5345" />
                    </filter>
                </defs>
            </svg>
        )
    },

    everscale1BlockchainIcon: ({ ratio, ...props }) => {
        const gradientId = uniqueKey()
        return (
            <svg {...defaultProps} {...props} viewBox="0 0 600 600" {...getSize(20, 20, ratio)}>
                <path
                    d="M300 600C465.685 600 600 465.685 600 300C600 134.315 465.685 0 300 0C134.315 0 0 134.315 0 300C0 465.685 134.315 600 300 600Z"
                    fill={`url(#paint0_linear_126_${gradientId})`}
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M322.598 505L445 383.512V155H216.488L95 277.5H322.5L322.598 505Z"
                    fill="white"
                />
                <defs>
                    <linearGradient
                        id={`paint0_linear_126_${gradientId}`}
                        x1="600"
                        y1="0.000226805"
                        x2="54.5601"
                        y2="541.13"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#FF6922" />
                        <stop offset="1" stopColor="#6347F5" />
                    </linearGradient>
                </defs>
            </svg>
        )
    },
    everCoinIcon: ({ ratio, ...props }) => {
        const gradientId = uniqueKey()
        return (
            <svg {...defaultProps} {...props} viewBox="0 0 600 600" {...getSize(20, 20, ratio)}>
                <path
                    d="M300 600C465.685 600 600 465.685 600 300C600 134.315 465.685 0 300 0C134.315 0 0 134.315 0 300C0 465.685 134.315 600 300 600Z"
                    fill={`url(#paint0_linear_126_${gradientId})`}
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M322.598 505L445 383.512V155H216.488L95 277.5H322.5L322.598 505Z"
                    fill="white"
                />
                <defs>
                    <linearGradient
                        id={`paint0_linear_126_${gradientId}`}
                        x1="600"
                        y1="0.000226805"
                        x2="54.5601"
                        y2="541.13"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#FF6922" />
                        <stop offset="1" stopColor="#6347F5" />
                    </linearGradient>
                </defs>
            </svg>
        )
    },
    everWalletIcon: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 1024 1024" {...getSize(20, 20, ratio)}>
            <rect width="1024" height="1024" rx="512" fill="#050B2E" className="uk-preserve" />
            <path
                d="M391.935 256L160 490.49H537.022V864L768 632.859V256H391.935Z"
                fill="#C5E4F3"
                className="uk-preserve"
            />
        </svg>
    ),

    sparxWalletIcon: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 1200 1200" {...getSize(20, 20, ratio)}>
            <g clipPath="url(#clip0_465_2)">
                <g filter="url(#filter0_d_465_2)">
                    <rect
                        x="20" y="20" width="1160"
                        height="1160" rx="580" fill="#0F1224"
                    />
                    <path d="M309.86 842.504L267.058 799.702L377.252 689.508C426.589 640.172 426.589 559.884 377.252 510.548L267 400.296L309.802 357.494L420.054 467.746C492.995 540.687 492.995 659.369 420.054 732.31L309.86 842.504Z" fill="url(#paint0_linear_465_2)" />
                    <path d="M799.702 933L689.508 822.806C640.172 773.47 559.885 773.47 510.549 822.806L400.354 933L357.552 890.198L467.747 780.004C540.688 707.063 659.369 707.063 732.31 780.004L842.504 890.198L799.702 933Z" fill="url(#paint1_linear_465_2)" />
                    <path d="M890.198 842.504L780.004 732.31C707.063 659.369 707.063 540.688 780.004 467.747L890.198 357.552L933 400.354L822.806 510.549C773.47 559.885 773.47 640.172 822.806 689.508L933 799.702L890.198 842.504Z" fill="url(#paint2_linear_465_2)" />
                    <path d="M600.019 474.765C552.114 474.765 504.208 456.535 467.747 420.055L357.495 309.802L400.297 267L510.549 377.253C559.885 426.589 640.173 426.589 689.509 377.253L799.703 267.058L842.505 309.86L732.311 420.055C695.83 456.515 647.944 474.765 600.039 474.765H600.019Z" fill="url(#paint3_linear_465_2)" />
                </g>
            </g>
            <defs>
                <filter
                    id="filter0_d_465_2" x="-25" y="-25"
                    width="1250" height="1250" filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="22.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.164706 0 0 0 0 0.741176 0 0 0 0 0.894118 0 0 0 0.1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_465_2" />
                    <feBlend
                        mode="normal" in="SourceGraphic" in2="effect1_dropShadow_465_2"
                        result="shape"
                    />
                </filter>
                <linearGradient
                    id="paint0_linear_465_2" x1="370.873" y1="839.875"
                    x2="370.873" y2="360.955" gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#00B2E3" stopOpacity="0" />
                    <stop offset="0.07" stopColor="#05B3E3" stopOpacity="0.03" />
                    <stop offset="0.19" stopColor="#13B7E3" stopOpacity="0.13" />
                    <stop offset="0.33" stopColor="#2ABDE4" stopOpacity="0.28" />
                    <stop offset="0.49" stopColor="#4AC5E5" stopOpacity="0.49" />
                    <stop offset="0.66" stopColor="#73D0E6" stopOpacity="0.75" />
                    <stop offset="0.81" stopColor="#9ADBE8" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_465_2" x1="840.687" y1="829.147"
                    x2="358.461" y2="829.147" gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#00B2E3" stopOpacity="0" />
                    <stop offset="0.07" stopColor="#05B3E3" stopOpacity="0.03" />
                    <stop offset="0.19" stopColor="#13B7E3" stopOpacity="0.13" />
                    <stop offset="0.33" stopColor="#2ABDE4" stopOpacity="0.28" />
                    <stop offset="0.49" stopColor="#4AC5E5" stopOpacity="0.49" />
                    <stop offset="0.66" stopColor="#73D0E6" stopOpacity="0.75" />
                    <stop offset="0.81" stopColor="#9ADBE8" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_465_2" x1="829.147" y1="358.326"
                    x2="829.147" y2="837.033" gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#00B2E3" stopOpacity="0" />
                    <stop offset="0.07" stopColor="#05B3E3" stopOpacity="0.03" />
                    <stop offset="0.19" stopColor="#13B7E3" stopOpacity="0.13" />
                    <stop offset="0.33" stopColor="#2ABDE4" stopOpacity="0.28" />
                    <stop offset="0.49" stopColor="#4AC5E5" stopOpacity="0.49" />
                    <stop offset="0.66" stopColor="#73D0E6" stopOpacity="0.75" />
                    <stop offset="0.81" stopColor="#9ADBE8" />
                </linearGradient>
                <linearGradient
                    id="paint3_linear_465_2" x1="356.296" y1="370.873"
                    x2="842.776" y2="370.873" gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#00B2E3" stopOpacity="0" />
                    <stop offset="0.07" stopColor="#05B3E3" stopOpacity="0.03" />
                    <stop offset="0.19" stopColor="#13B7E3" stopOpacity="0.13" />
                    <stop offset="0.33" stopColor="#2ABDE4" stopOpacity="0.28" />
                    <stop offset="0.49" stopColor="#4AC5E5" stopOpacity="0.49" />
                    <stop offset="0.66" stopColor="#73D0E6" stopOpacity="0.75" />
                    <stop offset="0.81" stopColor="#9ADBE8" />
                </linearGradient>
                <clipPath id="clip0_465_2">
                    <rect width="1200" height="1200" fill="white" />
                </clipPath>
            </defs>
        </svg>
    ),

    evm1BlockchainIcon: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 32 32" {...getSize(20, 20, ratio)}>
            <path
                d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                className="uk-preserve"
                fill="white"
            />
            <g clipPath="url(#clip0_1235_13413)">
                <path
                    d="M15.997 4L15.8359 4.54693V20.4161L15.997 20.5767L23.3631 16.2225L15.997 4Z"
                    className="uk-preserve"
                    fill="#343434"
                />
                <path
                    d="M15.9952 4L8.62891 16.2225L15.9952 20.5767V12.8743V4Z"
                    className="uk-preserve"
                    fill="#8C8C8C"
                />
                <path
                    d="M15.997 21.9713L15.9062 22.082V27.7348L15.997 27.9997L23.3677 17.6194L15.997 21.9713Z"
                    className="uk-preserve"
                    fill="#3C3C3B"
                />
                <path
                    d="M15.9952 27.9997V21.9713L8.62891 17.6194L15.9952 27.9997Z"
                    className="uk-preserve"
                    fill="#8C8C8C"
                />
                <path
                    d="M15.9941 20.5767L23.3603 16.2225L15.9941 12.8742V20.5767Z"
                    className="uk-preserve"
                    fill="#141414"
                />
                <path
                    d="M8.62891 16.2225L15.9952 20.5767V12.8742L8.62891 16.2225Z"
                    className="uk-preserve"
                    fill="#393939"
                />
            </g>
            <defs>
                <clipPath id="clip0_1235_13413">
                    <rect width="24" height="24" className="uk-preserve" fill="white" transform="translate(4 4)" />
                </clipPath>
            </defs>
        </svg>
    ),
    evm56BlockchainIcon: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 34 40" {...getSize(20, 20, ratio)}>
            <path
                className="uk-preserve"
                d="M17 0L6.56211 6.12683L10.3996 8.39024L17 4.52683L23.6004 8.39024L27.4379 6.12683L17 0Z"
                fill="#F0B90B"
            />
            <path
                className="uk-preserve"
                d="M23.6004 11.5902L27.4379 13.8537V18.3805L20.8375 22.2439V29.9707L17 32.2341L13.1625 29.9707V22.2439L6.56211 18.3805V13.8537L10.3996 11.5902L17 15.4537L23.6004 11.5902Z"
                fill="#F0B90B"
            />
            <path
                className="uk-preserve"
                d="M27.4379 21.5805V26.1073L23.6004 28.3707V23.8439L27.4379 21.5805Z"
                fill="#F0B90B"
            />
            <path
                className="uk-preserve"
                d="M23.5621 31.5707L30.1625 27.7073V19.9805L34 17.7171V29.9707L23.5621 36.0976V31.5707Z"
                fill="#F0B90B"
            />
            <path
                className="uk-preserve"
                d="M30.1625 12.2537L26.3251 9.99025L30.1625 7.72683L34 9.99025V14.5171L30.1625 16.7805V12.2537Z"
                fill="#F0B90B"
            />
            <path
                className="uk-preserve"
                d="M13.1625 37.7366V33.2098L17 35.4732L20.8375 33.2098V37.7366L17 40L13.1625 37.7366Z"
                fill="#F0B90B"
            />
            <path
                className="uk-preserve"
                d="M10.3996 28.3707L6.56211 26.1073V21.5805L10.3996 23.8439V28.3707Z"
                fill="#F0B90B"
            />
            <path
                className="uk-preserve"
                d="M17 12.2537L13.1625 9.99025L17 7.72683L20.8375 9.99025L17 12.2537Z"
                fill="#F0B90B"
            />
            <path
                className="uk-preserve"
                d="M7.67493 9.99025L3.83747 12.2537V16.7805L0 14.5171V9.99025L3.83747 7.72683L7.67493 9.99025Z"
                fill="#F0B90B"
            />
            <path
                className="uk-preserve"
                d="M0 17.7171L3.83747 19.9805V27.7073L10.4379 31.5707V36.0976L0 29.9707V17.7171Z"
                fill="#F0B90B"
            />
        </svg>
    ),
    evm137BlockchainIcon: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 32 32" {...getSize(20, 20, ratio)}>
            <path
                d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                className="uk-preserve"
                fill="white"
            />
            <path
                d="M21.1436 13.1958C20.7781 12.9941 20.3081 12.9941 19.8903 13.1958L16.9661 14.8605L14.9817 15.9199L12.1097 17.5846C11.7441 17.7864 11.2742 17.7864 10.8564 17.5846L8.61097 16.273C8.24543 16.0712 7.98433 15.6677 7.98433 15.2136V12.6914C7.98433 12.2878 8.19321 11.8843 8.61097 11.632L10.8564 10.3709C11.2219 10.1691 11.6919 10.1691 12.1097 10.3709L14.3551 11.6825C14.7206 11.8843 14.9817 12.2878 14.9817 12.7418V14.4065L16.9661 13.2967V11.5816C16.9661 11.178 16.7572 10.7745 16.3394 10.5223L12.1619 8.15134C11.7963 7.94955 11.3264 7.94955 10.9086 8.15134L6.62663 10.5727C6.20888 10.7745 6 11.178 6 11.5816V16.3234C6 16.727 6.20888 17.1306 6.62663 17.3828L10.8564 19.7537C11.2219 19.9555 11.6919 19.9555 12.1097 19.7537L14.9817 18.1395L16.9661 17.0297L19.8381 15.4154C20.2037 15.2137 20.6736 15.2137 21.0914 15.4154L23.3368 16.6766C23.7023 16.8783 23.9634 17.2819 23.9634 17.7359V20.2582C23.9634 20.6617 23.7546 21.0653 23.3368 21.3175L21.1436 22.5786C20.7781 22.7804 20.3081 22.7804 19.8903 22.5786L17.6449 21.3175C17.2794 21.1157 17.0183 20.7122 17.0183 20.2582V18.6439L15.0339 19.7537V21.4184C15.0339 21.822 15.2428 22.2255 15.6606 22.4777L19.8903 24.8487C20.2559 25.0504 20.7258 25.0504 21.1436 24.8487L25.3734 22.4777C25.7389 22.276 26 21.8724 26 21.4184V16.6261C26 16.2226 25.7911 15.819 25.3734 15.5668L21.1436 13.1958Z"
                className="uk-preserve"
                fill="#8247E5"
            />
        </svg>
    ),
    evm250BlockchainIcon: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 1024 1024" {...getSize(20, 20, ratio)}>
            <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                <g>
                    <circle className="uk-preserve" fill="#1969FF" cx="512" cy="512" r="512" />
                    <path
                        className="uk-preserve"
                        d="M480.952632,162.820404 C498.202214,153.726532 524.449007,153.726532 541.698589,162.820404 L717.715301,255.615438 C728.104233,261.091936 733.809736,269.25319 734.831811,277.678216 L735,277.678216 L735,744.110155 C734.770819,753.300673 729.011717,762.429399 717.715301,768.384559 L541.698589,861.179741 C524.449007,870.27342 498.202214,870.27342 480.952632,861.179741 L304.936382,768.384559 C293.687466,762.4543 288.288954,753.261937 288.021607,744.110155 C287.994161,743.171274 287.991758,742.397481 288.020775,741.760186 L288.021607,280.818578 C287.995362,280.170216 287.995085,279.52462 288.02096,278.881791 L288.021607,277.678216 L288.100249,277.678216 C288.882053,269.16004 294.328618,261.207221 304.936382,255.615438 L480.952632,162.820404 Z M707,537 L541.644818,624.459967 C524.420262,633.571112 498.21155,633.571112 480.986994,624.459967 L316,537.194955 L316,742.669239 L480.986994,829.471349 C490.737056,834.688013 500.874684,839.770703 510.746553,839.992453 L511.315906,840 C521.168396,840.032183 530.733903,835.022485 540.433212,830.279812 L707,741.920834 L707,537 Z M260.423841,734 C260.423841,751.880605 262.483542,763.633063 266.573125,771.912197 C269.962755,778.774873 275.048664,784.019001 284.335203,790.400911 L284.865291,790.762639 C286.903313,792.149569 289.148339,793.602016 291.881192,795.308227 L295.103883,797.299574 L305,803.325293 L290.80629,827 L279.729986,820.250826 L277.868233,819.097358 C274.665666,817.102319 272.011205,815.389649 269.535301,813.704662 C243.068452,795.702251 233.197716,776.074834 233.002947,735.2439 L233,734 L260.423841,734 Z M498,413 C496.719282,413.440417 495.51884,413.951152 494.424509,414.530355 L318.676529,507.623888 C318.49208,507.721039 318.316212,507.818189 318.148833,507.91349 L318,507.999537 L318.275982,508.15868 L318.676529,508.376112 L494.424509,601.469645 C495.51884,602.048848 496.719282,602.559583 498,603 L498,413 Z M526,413 L526,603 C527.281635,602.559583 528.482071,602.048848 529.576397,601.469645 L705.322736,508.376112 C705.507277,508.278961 705.683513,508.181811 705.850522,508.08651 L706,507.999537 L705.724112,507.84132 L705.322736,507.623888 L529.576397,414.530355 C528.482071,413.951152 527.281635,413.440417 526,413 Z M707,311 L549,394 L707,477 L707,311 Z M316,311 L316,477 L474,394 L316,311 Z M529.422488,187.627114 C520.27514,182.790962 503.724952,182.790962 494.577605,187.627114 L318.677116,280.623711 C318.492507,280.721685 318.316486,280.817811 318.148962,280.913937 L318,280.999896 L318.276221,281.157949 L318.677116,281.376081 L494.577605,374.3724 C503.724952,379.2092 520.27514,379.2092 529.422488,374.3724 L705.322145,281.376081 C705.506847,281.278107 705.683237,281.181981 705.850392,281.086779 L706,280.999896 L705.723871,280.841843 L705.322145,280.623711 L529.422488,187.627114 Z M733.193821,197 L744.270251,203.749273 L746.131721,204.902466 C749.33418,206.896953 751.988718,208.610547 754.464885,210.294705 C780.931599,228.297503 790.802419,247.925124 790.997256,288.756099 L791,290 L763.576481,290 C763.576481,272.118455 761.516516,260.366907 757.426771,252.086842 C754.037707,245.224806 748.951824,239.980488 739.665515,233.599218 L739.134973,233.236751 C737.096961,231.850558 734.852221,230.398109 732.119016,228.691528 L728.896433,226.700086 L719,220.674731 L733.193821,197 Z"
                        fill="#FFFFFF"
                        fillRule="nonzero"
                    />
                </g>
            </g>
        </svg>
    ),
    evm2001BlockchainIcon: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 32 32" {...getSize(20, 20, ratio)}>
            <path
                d="M0 16C0 7.16344 7.16344 0 16 0V0C24.8366 0 32 7.16344 32 16V16C32 24.8366 24.8366 32 16 32V32C7.16344 32 0 24.8366 0 16V16Z"
                className="uk-preserve"
                fill="black"
            />
            <path
                d="M27.1725 13.4449L29.0001 16.6088L19.3734 22.1675C19.3734 22.1675 13.4778 25.7307 9.23901 18.3845L12.2366 16.6548C12.2366 16.6548 14.1845 20.9604 17.5607 19.0051C20.9368 17.0497 27.1725 13.4449 27.1725 13.4449Z"
                className="uk-preserve"
                fill="white"
            />
            <path
                d="M4.82765 18.3623L3 15.1984L12.8316 9.52244C12.8316 9.52244 18.7273 5.9592 22.9646 13.3054L19.967 15.0351C19.967 15.0351 18.0191 10.7295 14.6429 12.6848C11.2667 14.6402 4.82765 18.3623 4.82765 18.3623Z"
                className="uk-preserve"
                fill="white"
            />
            <path
                d="M16.1854 18.2849C17.5121 18.2849 18.5876 17.2094 18.5876 15.8827C18.5876 14.556 17.5121 13.4805 16.1854 13.4805C14.8587 13.4805 13.7832 14.556 13.7832 15.8827C13.7832 17.2094 14.8587 18.2849 16.1854 18.2849Z"
                className="uk-preserve"
                fill="#FF931E"
            />
            <path
                d="M7.70378 22.0353C8.39665 22.0353 8.95834 21.4737 8.95834 20.7808C8.95834 20.0879 8.39665 19.5263 7.70378 19.5263C7.01091 19.5263 6.44922 20.0879 6.44922 20.7808C6.44922 21.4737 7.01091 22.0353 7.70378 22.0353Z"
                className="uk-preserve"
                fill="white"
            />
            <path
                d="M24.4489 12.3657C25.1417 12.3657 25.7035 11.804 25.7035 11.1111C25.7035 10.4183 25.1417 9.85657 24.4489 9.85657C23.756 9.85657 23.1943 10.4183 23.1943 11.1111C23.1943 11.804 23.756 12.3657 24.4489 12.3657Z"
                className="uk-preserve"
                fill="white"
            />
        </svg>
    ),
    evm43114BlockchainIcon: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 32 32" {...getSize(20, 20, ratio)}>
            <path
                d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
                className="uk-preserve"
                fill="#E84142"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.4691 22.3587H8.36598C7.71393 22.3587 7.39184 22.3587 7.19546 22.2332C6.98334 22.0958 6.85372 21.8681 6.83801 21.6168C6.82621 21.3853 6.98728 21.1026 7.30936 20.5374L14.9713 7.04118C15.2973 6.46808 15.4623 6.18152 15.6704 6.07555C15.8943 5.96172 16.1614 5.96172 16.3853 6.07555C16.5935 6.18152 16.7585 6.46808 17.0845 7.04118L18.6596 9.78893L18.6677 9.80295C19.0198 10.4178 19.1984 10.7296 19.2763 11.0568C19.3627 11.414 19.3627 11.7908 19.2763 12.1481C19.1978 12.4778 19.021 12.7918 18.6636 13.4159L14.6389 20.5256L14.6285 20.5438C14.2741 21.1637 14.0944 21.4779 13.8455 21.7149C13.5745 21.9741 13.2484 22.1624 12.891 22.2685C12.565 22.3587 12.1997 22.3587 11.4691 22.3587ZM19.3054 22.3587H23.7517C24.4077 22.3587 24.7377 22.3587 24.9342 22.2294C25.1463 22.0919 25.2798 21.8602 25.2917 21.6092C25.303 21.3851 25.1454 21.1134 24.8367 20.581C24.8261 20.5629 24.8154 20.5444 24.8046 20.5257L22.5773 16.7181L22.552 16.6752C22.239 16.1463 22.0811 15.8792 21.8782 15.776C21.6544 15.6622 21.391 15.6622 21.1672 15.776C20.963 15.882 20.798 16.1607 20.472 16.722L18.2527 20.5296L18.2451 20.5427C17.9202 21.1031 17.7578 21.3832 17.7696 21.613C17.7853 21.8643 17.9149 22.0958 18.127 22.2332C18.3195 22.3587 18.6494 22.3587 19.3054 22.3587Z"
                className="uk-preserve"
                fill="white"
            />
        </svg>
    ),
    evm8217BlockchainIcon: ({ ratio, ...props }) => {
        const clipPathId = uniqueKey()
        const gradientId = uniqueKey()
        return (
            <svg {...defaultProps} {...props} viewBox="0 0 32 32" {...getSize(20, 20, ratio)}>
                <g clipPath={`url(#clip${clipPathId})`}>
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M26.1375 28.2368L16.0383 18.0224L5.79833 28.3136C7.83353 29.6704 11.0207 31.9872 15.9359 32.0128C20.8511 32.0384 24.7935 29.5936 26.1247 28.2496L26.1375 28.2368ZM28.2367 5.76L17.9967 15.9744C21.4271 19.392 24.8063 22.848 28.1983 26.2912C33.5103 19.5072 33.0239 12.5184 28.2367 5.7472V5.76ZM3.71193 26.1376L12.5823 2.5216L0.140732 15.04C-0.499268 18.688 1.39513 23.3216 3.71193 26.1376ZM8.38393 21.4912C9.02393 21.3248 23.1295 6.8352 26.1631 3.8272C24.5887 1.728 19.1871 -0.0895954 16.4863 4.61121e-06L8.38393 21.4912Z"
                        fill={`url(#paint${gradientId})`}
                    />
                </g>
                <defs>
                    <linearGradient
                        id={`paint${gradientId}`}
                        x1="8.78254"
                        y1="30.3066"
                        x2="24.6801"
                        y2="2.53063"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#850000" />
                        <stop offset="0.251" stopColor="#C70158" />
                        <stop offset="0.4824" stopColor="#DE1E41" />
                        <stop offset="0.6392" stopColor="#F63B2A" />
                        <stop offset="1" stopColor="#FF8700" />
                    </linearGradient>
                    <clipPath id={`clip${clipPathId}`}>
                        <rect width="32" height="32" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        )
    },

    metamaskWalletIcon: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 35 33" {...getSize(33, 35, ratio)}>
            <g strokeLinecap="round" strokeLinejoin="round" strokeWidth=".25">
                <path
                    d="m32.9582 1-13.1341 9.7183 2.4424-5.72731z"
                    className="uk-preserve"
                    fill="#e17726"
                    stroke="#e17726"
                />
                <g className="uk-preserve" fill="#e27625" stroke="#e27625">
                    <path d="m2.66296 1 13.01714 9.809-2.3254-5.81802z" />
                    <path d="m28.2295 23.5335-3.4947 5.3386 7.4829 2.0603 2.1436-7.2823z" />
                    <path d="m1.27281 23.6501 2.13055 7.2823 7.46994-2.0603-3.48166-5.3386z" />
                    <path d="m10.4706 14.5149-2.0786 3.1358 7.405.3369-.2469-7.969z" />
                    <path d="m25.1505 14.5149-5.1575-4.58704-.1688 8.05974 7.4049-.3369z" />
                    <path d="m10.8733 28.8721 4.4819-2.1639-3.8583-3.0062z" />
                    <path d="m20.2659 26.7082 4.4689 2.1639-.6105-5.1701z" />
                </g>
                <path
                    d="m24.7348 28.8721-4.469-2.1639.3638 2.9025-.039 1.231z"
                    className="uk-preserve"
                    fill="#d5bfb2"
                    stroke="#d5bfb2"
                />
                <path
                    d="m10.8732 28.8721 4.1572 1.9696-.026-1.231.3508-2.9025z"
                    className="uk-preserve"
                    fill="#d5bfb2"
                    stroke="#d5bfb2"
                />
                <path
                    d="m15.1084 21.7842-3.7155-1.0884 2.6243-1.2051z"
                    className="uk-preserve"
                    fill="#233447"
                    stroke="#233447"
                />
                <path
                    d="m20.5126 21.7842 1.0913-2.2935 2.6372 1.2051z"
                    className="uk-preserve"
                    fill="#233447"
                    stroke="#233447"
                />
                <path
                    d="m10.8733 28.8721.6495-5.3386-4.13117.1167z"
                    className="uk-preserve"
                    fill="#cc6228"
                    stroke="#cc6228"
                />
                <path
                    d="m24.0982 23.5335.6366 5.3386 3.4946-5.2219z"
                    className="uk-preserve"
                    fill="#cc6228"
                    stroke="#cc6228"
                />
                <path
                    d="m27.2291 17.6507-7.405.3369.6885 3.7966 1.0913-2.2935 2.6372 1.2051z"
                    className="uk-preserve"
                    fill="#cc6228"
                    stroke="#cc6228"
                />
                <path
                    d="m11.3929 20.6958 2.6242-1.2051 1.0913 2.2935.6885-3.7966-7.40495-.3369z"
                    className="uk-preserve"
                    fill="#cc6228"
                    stroke="#cc6228"
                />
                <path
                    d="m8.392 17.6507 3.1049 6.0513-.1039-3.0062z"
                    className="uk-preserve"
                    fill="#e27525"
                    stroke="#e27525"
                />
                <path
                    d="m24.2412 20.6958-.1169 3.0062 3.1049-6.0513z"
                    className="uk-preserve"
                    fill="#e27525"
                    stroke="#e27525"
                />
                <path
                    d="m15.797 17.9876-.6886 3.7967.8704 4.4833.1949-5.9087z"
                    className="uk-preserve"
                    fill="#e27525"
                    stroke="#e27525"
                />
                <path
                    d="m19.8242 17.9876-.3638 2.3584.1819 5.9216.8704-4.4833z"
                    className="uk-preserve"
                    fill="#e27525"
                    stroke="#e27525"
                />
                <path
                    d="m20.5127 21.7842-.8704 4.4834.6236.4406 3.8584-3.0062.1169-3.0062z"
                    className="uk-preserve"
                    fill="#f5841f"
                    stroke="#f5841f"
                />
                <path
                    d="m11.3929 20.6958.104 3.0062 3.8583 3.0062.6236-.4406-.8704-4.4834z"
                    className="uk-preserve"
                    fill="#f5841f"
                    stroke="#f5841f"
                />
                <path
                    d="m20.5906 30.8417.039-1.231-.3378-.2851h-4.9626l-.3248.2851.026 1.231-4.1572-1.9696 1.4551 1.1921 2.9489 2.0344h5.0536l2.962-2.0344 1.442-1.1921z"
                    className="uk-preserve"
                    fill="#c0ac9d"
                    stroke="#c0ac9d"
                />
                <path
                    d="m20.2659 26.7082-.6236-.4406h-3.6635l-.6236.4406-.3508 2.9025.3248-.2851h4.9626l.3378.2851z"
                    className="uk-preserve"
                    fill="#161616"
                    stroke="#161616"
                />
                <path
                    d="m33.5168 11.3532 1.1043-5.36447-1.6629-4.98873-12.6923 9.3944 4.8846 4.1205 6.8983 2.0085 1.52-1.7752-.6626-.4795 1.0523-.9588-.8054-.622 1.0523-.8034z"
                    className="uk-preserve"
                    fill="#763e1a"
                    stroke="#763e1a"
                />
                <path
                    d="m1 5.98873 1.11724 5.36447-.71451.5313 1.06527.8034-.80545.622 1.05228.9588-.66255.4795 1.51997 1.7752 6.89835-2.0085 4.8846-4.1205-12.69233-9.3944z"
                    className="uk-preserve"
                    fill="#763e1a"
                    stroke="#763e1a"
                />
                <path
                    d="m32.0489 16.5234-6.8983-2.0085 2.0786 3.1358-3.1049 6.0513 4.1052-.0519h6.1318z"
                    className="uk-preserve"
                    fill="#f5841f"
                    stroke="#f5841f"
                />
                <path
                    d="m10.4705 14.5149-6.89828 2.0085-2.29944 7.1267h6.11883l4.10519.0519-3.10487-6.0513z"
                    className="uk-preserve"
                    fill="#f5841f"
                    stroke="#f5841f"
                />
                <path
                    d="m19.8241 17.9876.4417-7.5932 2.0007-5.4034h-8.9119l2.0006 5.4034.4417 7.5932.1689 2.3842.013 5.8958h3.6635l.013-5.8958z"
                    className="uk-preserve"
                    fill="#f5841f"
                    stroke="#f5841f"
                />
            </g>
        </svg>
    ),
    walletConnectIcon: ({ ratio, ...props }) => {
        const gradientId = uniqueKey()
        return (
            <svg {...defaultProps} {...props} viewBox="0 0 512 512" {...getSize(20, 20, ratio)}>
                <defs>
                    <radialGradient cx="0%" cy="50%" fx="0%" fy="50%" r="100%" id={gradientId}>
                        <stop stopColor="#5D9DF6" offset="0%"></stop>
                        <stop stopColor="#006FFF" offset="100%"></stop>
                    </radialGradient>
                </defs>
                <rect fill={`url(#${gradientId})`} x="0" y="0" width="512" height="512" rx="256" />
                <path
                    d="M169.209772,184.531136 C217.142772,137.600733 294.857519,137.600733 342.790517,184.531136 L348.559331,190.179285 C350.955981,192.525805 350.955981,196.330266 348.559331,198.676787 L328.82537,217.99798 C327.627045,219.171241 325.684176,219.171241 324.485851,217.99798 L316.547278,210.225455 C283.10802,177.485633 228.89227,177.485633 195.453011,210.225455 L186.951456,218.549188 C185.75313,219.722448 183.810261,219.722448 182.611937,218.549188 L162.877976,199.227995 C160.481326,196.881474 160.481326,193.077013 162.877976,190.730493 L169.209772,184.531136 Z M383.602212,224.489406 L401.165475,241.685365 C403.562113,244.031874 403.562127,247.836312 401.165506,250.182837 L321.971538,327.721548 C319.574905,330.068086 315.689168,330.068112 313.292501,327.721609 C313.292491,327.721599 313.29248,327.721588 313.29247,327.721578 L257.08541,272.690097 C256.486248,272.103467 255.514813,272.103467 254.915651,272.690097 C254.915647,272.690101 254.915644,272.690105 254.91564,272.690108 L198.709777,327.721548 C196.313151,330.068092 192.427413,330.068131 190.030739,327.721634 C190.030725,327.72162 190.03071,327.721606 190.030695,327.721591 L110.834524,250.181849 C108.437875,247.835329 108.437875,244.030868 110.834524,241.684348 L128.397819,224.488418 C130.794468,222.141898 134.680206,222.141898 137.076856,224.488418 L193.284734,279.520668 C193.883897,280.107298 194.85533,280.107298 195.454493,279.520668 C195.454502,279.520659 195.45451,279.520651 195.454519,279.520644 L251.65958,224.488418 C254.056175,222.141844 257.941913,222.141756 260.338618,224.488222 C260.338651,224.488255 260.338684,224.488288 260.338717,224.488321 L316.546521,279.520644 C317.145683,280.107273 318.117118,280.107273 318.71628,279.520644 L374.923175,224.489406 C377.319825,222.142885 381.205562,222.142885 383.602212,224.489406 Z"
                    fill="#fff"
                    fillRule="nonzero"
                />
            </svg>
        )
    },

    solana1BlockchainIcon: ({ ratio, ...props }) => {
        const gradient1Id = uniqueKey()
        const gradient2Id = uniqueKey()
        const gradient3Id = uniqueKey()
        return (
            <svg {...defaultProps} {...props} viewBox="0 0 397.7 311.7" {...getSize(20, 20, ratio)}>
                <linearGradient
                    id={`paint0_linear_127_${gradient1Id}`}
                    gradientUnits="userSpaceOnUse"
                    x1="360.8791"
                    y1="351.4553"
                    x2="141.213"
                    y2="-69.2936"
                    gradientTransform="matrix(1 0 0 -1 0 314)"
                >
                    <stop offset="0" stopColor="#00FFA3" />
                    <stop offset="1" stopColor="#DC1FFF" />
                </linearGradient>
                <path
                    fill={`url(#paint0_linear_127_${gradient1Id})`}
                    d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"
                />
                <linearGradient
                    id={`paint0_linear_127_${gradient2Id}`}
                    gradientUnits="userSpaceOnUse"
                    x1="264.8291"
                    y1="401.6014"
                    x2="45.163"
                    y2="-19.1475"
                    gradientTransform="matrix(1 0 0 -1 0 314)"
                >
                    <stop offset="0" stopColor="#00FFA3" />
                    <stop offset="1" stopColor="#DC1FFF" />
                </linearGradient>
                <path
                    fill={`url(#paint0_linear_127_${gradient2Id})`}
                    d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"
                />
                <linearGradient
                    id={`paint0_linear_127_${gradient3Id}`}
                    gradientUnits="userSpaceOnUse"
                    x1="312.5484"
                    y1="376.688"
                    x2="92.8822"
                    y2="-44.061"
                    gradientTransform="matrix(1 0 0 -1 0 314)"
                >
                    <stop offset="0" stopColor="#00FFA3" />
                    <stop offset="1" stopColor="#DC1FFF" />
                </linearGradient>
                <path
                    fill={`url(#paint0_linear_127_${gradient3Id})`}
                    d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"
                />
            </svg>
        )
    },

    menu: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 24 24" {...getSize(20, 20, ratio)}>
            <path fillRule="evenodd" clipRule="evenodd" d="M22 5V7H2V5H22Z" fill="currentColor" fillOpacity={0.48} />
            <path fillRule="evenodd" clipRule="evenodd" d="M22 11V13H2V11H22Z" fill="currentColor" fillOpacity={0.48} />
            <path fillRule="evenodd" clipRule="evenodd" d="M22 17V19H2V17H22Z" fill="currentColor" fillOpacity={0.48} />
        </svg>
    ),
    arrowDown: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path d="M10 13L5 8H15L10 13Z" fill="white" fillOpacity="0.48" />
        </svg>
    ),
    arrowLeft: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path d="M7 10L12 5L12 15L7 10Z" fill="currentColor" fillOpacity="0.48" />
        </svg>
    ),
    arrowRight: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path d="M13 10L8 15L8 5L13 10Z" fill="currentColor" fillOpacity="0.48" />
        </svg>
    ),
    externalLink: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 512 512" {...getSize(20, 20, ratio)}>
            <path
                d="M511.5,0.9v255.5h-34.4V63.2L159.4,381l-24.2-24.2L457.6,34.4H256V0h255.5V0.9z M374.9,477.6H34.8V137.5 h223.9v-34.4H0.5V512h408.9V249h-34.4V477.6z"
                fill="currentColor"
                strokeWidth={1.6}
            />
        </svg>
    ),
    close: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 40 40" {...getSize(40, 40, ratio)}>
            <path d="M14 14L20 20M20 20L14 26M20 20L26 14M20 20L26 26" stroke="currentColor" strokeWidth={2} />
        </svg>
    ),
    info: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17ZM10.75 9V14H9.25V9H10.75ZM10.75 7V5.5H9.25V7H10.75Z"
            />
        </svg>
    ),
    loader: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 22 22" {...getSize(22, 22, ratio)}>
            <path
                d="M11 22C17.0959 22 22 17.0959 22 11C22 7.12134 20.0146 3.72514 17 1.76773L16 3.45543C18.4345 5.04268 20 7.78975 20 11C20 16.0799 16.0799 20 11 20C5.92011 20 2 16.0799 2 11C2 5.92011 5.92011 2 11 2V0C4.90413 0 0 4.90413 0 11C0 17.0959 4.90413 22 11 22Z"
                fill="currentColor"
            />
        </svg>
    ),
    logout: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 32 32" {...getSize(32, 32, ratio)}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.4753 18.2903H19.295H20.1146V21.5162V23.9355H15.1966L15.1967 27L13.0492 26.2799L8.11633 24.662C7.4459 24.433 7 24.2782 7 24.2782V7H8.63938C8.66196 7 8.68378 7.00459 8.70558 7.00919C8.72248 7.01275 8.73936 7.0163 8.75659 7.01772C8.76929 7.01605 8.78125 7.01267 8.79315 7.00931C8.80968 7.00464 8.8261 7 8.84424 7H17.6556H20.1146V11.8387H19.295H18.4753L18.4754 8.61267L17.6556 8.61281H13.8376H11.918L15.1966 9.41936V22.3226H18.4753V21.5162V18.2903ZM23.153 11.2686L27 15.0644C27 15.0644 26.7522 15.3194 26.4318 15.6346L23.153 18.8605L21.7541 20.2257L21.7539 15.8709H17.6556V15.0645V14.2581H21.7539L21.7541 9.90301L23.153 11.2686Z"
            />
        </svg>
    ),
    plus: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 36 36" {...getSize(36, 36, ratio)}>
            <path d="M18 27V9" stroke="currentColor" strokeWidth={2} />
            <path d="M9 18L27 18" stroke="currentColor" strokeWidth={2} />
        </svg>
    ),
    remove: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 14 14" {...getSize(14, 14, ratio)}>
            <path d="M1 1L7 7M7 7L1 13M7 7L13 1M7 7L13 13" stroke="currentColor" strokeWidth={2} />
        </svg>
    ),
    star: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 24 24" {...getSize(24, 24, ratio)}>
            <path
                d="M14.6258 8.82306L14.7857 9.24051L15.2317 9.27097L22.2779 9.7522L16.8465 14.5363L16.5284 14.8165L16.6294 15.2283L18.3978 22.4392L12.3794 18.4874L11.9952 18.2351L11.611 18.4874L5.59272 22.4392L7.36114 15.2283L7.46204 14.8168L7.14433 14.5366L1.72029 9.7522L8.75876 9.27096L9.20473 9.24047L9.36467 8.82306L11.9952 1.95785L14.6258 8.82306Z"
                stroke="currentColor"
                strokeWidth={1.4}
            />
        </svg>
    ),
    copy: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path d="M16 13V4H8M4 17H12.6V7H4V17Z" stroke="currentColor" strokeWidth="1.4" />
        </svg>
    ),
    twitter: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path
                d="M19 4.77577C18.3306 5.07692 17.6174 5.27654 16.8737 5.37346C17.6388 4.905 18.2226 4.16885 18.4971 3.28154C17.7839 3.71769 16.9964 4.02577 16.1571 4.19769C15.4799 3.45808 14.5146 3 13.4616 3C11.4186 3 9.77387 4.70077 9.77387 6.78577C9.77387 7.08577 9.79862 7.37423 9.85938 7.64885C6.7915 7.49538 4.07687 5.98731 2.25325 3.69C1.93487 4.25654 1.74813 4.905 1.74813 5.60308C1.74813 6.91385 2.40625 8.07577 3.38725 8.74846C2.79437 8.73692 2.21275 8.56038 1.72 8.28231C1.72 8.29385 1.72 8.30885 1.72 8.32385C1.72 10.1631 2.99912 11.6908 4.6765 12.0427C4.37612 12.1269 4.04875 12.1673 3.709 12.1673C3.47275 12.1673 3.23425 12.1535 3.01038 12.1027C3.4885 13.6015 4.84525 14.7035 6.4585 14.7392C5.203 15.7465 3.60888 16.3535 1.88313 16.3535C1.5805 16.3535 1.29025 16.3396 1 16.3015C2.63462 17.3827 4.57188 18 6.661 18C13.4515 18 17.164 12.2308 17.164 7.23C17.164 7.06269 17.1584 6.90115 17.1505 6.74077C17.8829 6.20769 18.4982 5.54192 19 4.77577Z"
                fill="currentColor"
            />
        </svg>
    ),
    github: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path
                d="M10 1C5.0275 1 1 5.13211 1 10.2284C1 14.3065 3.5785 17.7648 7.15375 18.9841C7.60375 19.0709 7.76875 18.7853 7.76875 18.5403C7.76875 18.3212 7.76125 17.7405 7.7575 16.9712C5.254 17.5277 4.726 15.7332 4.726 15.7332C4.3165 14.6681 3.72475 14.3832 3.72475 14.3832C2.9095 13.8111 3.78775 13.8229 3.78775 13.8229C4.6915 13.887 5.16625 14.7737 5.16625 14.7737C5.96875 16.1847 7.273 15.777 7.7875 15.5414C7.8685 14.9443 8.10025 14.5381 8.3575 14.3073C6.35875 14.0764 4.258 13.2829 4.258 9.74709C4.258 8.73988 4.60675 7.91659 5.18425 7.27095C5.083 7.03774 4.77925 6.0994 5.263 4.82846C5.263 4.82846 6.01675 4.58116 7.738 5.77462C8.458 5.56958 9.223 5.46785 9.988 5.46315C10.753 5.46785 11.518 5.56958 12.238 5.77462C13.948 4.58116 14.7017 4.82846 14.7017 4.82846C15.1855 6.0994 14.8818 7.03774 14.7917 7.27095C15.3655 7.91659 15.7142 8.73988 15.7142 9.74709C15.7142 13.2923 13.6105 14.0725 11.608 14.2995C11.923 14.5765 12.2155 15.1423 12.2155 16.0071C12.2155 17.242 12.2043 18.2344 12.2043 18.5341C12.2043 18.7759 12.3617 19.0647 12.823 18.9723C16.4237 17.7609 19 14.3002 19 10.2284C19 5.13211 14.9703 1 10 1Z"
                fill="currentColor"
            />
        </svg>
    ),
    medium: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.3953 9.69767C11.3953 12.8444 8.84441 15.3953 5.69767 15.3953C2.55094 15.3953 0 12.8444 0 9.69767C0 6.55094 2.55094 4 5.69767 4C8.84441 4 11.3953 6.55094 11.3953 9.69767ZM17.4419 9.69767C17.4419 12.716 16.1924 15.1628 14.6512 15.1628C13.1099 15.1628 11.8605 12.716 11.8605 9.69767C11.8605 6.67937 13.1099 4.23256 14.6512 4.23256C16.1924 4.23256 17.4419 6.67937 17.4419 9.69767ZM18.9535 14.4651C19.5315 14.4651 20 12.2786 20 9.5814C20 6.88419 19.5315 4.69767 18.9535 4.69767C18.3755 4.69767 17.907 6.88419 17.907 9.5814C17.907 12.2786 18.3755 14.4651 18.9535 14.4651Z"
                fill="currentColor"
            />
        </svg>
    ),
    telegram: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path
                d="M3.09992 9.02697C7.39487 7.05126 10.2589 5.74875 11.6919 5.11944C15.7834 3.32264 16.6335 3.01052 17.1877 3.0001C17.3095 2.99794 17.582 3.02983 17.7586 3.18106C17.9076 3.30876 17.9486 3.48125 17.9683 3.60232C17.9879 3.72339 18.0123 3.99919 17.9929 4.21469C17.7712 6.67437 16.8118 12.6434 16.3237 15.3983C16.1172 16.564 15.7105 16.9548 15.3168 16.9931C14.4613 17.0762 13.8116 16.3961 12.9829 15.8226C11.6862 14.9251 10.9537 14.3664 9.69503 13.4907C8.24042 12.4786 9.18338 11.9224 10.0124 11.0133C10.2293 10.7754 13.999 7.15516 14.0719 6.82675C14.0811 6.78568 14.0895 6.63258 14.0034 6.55173C13.9172 6.47089 13.7901 6.49853 13.6983 6.52052C13.5683 6.55169 11.4968 7.9973 7.48389 10.8573C6.89591 11.2836 6.36333 11.4913 5.88616 11.4805C5.36012 11.4685 4.34822 11.1664 3.59598 10.9083C2.67333 10.5916 1.94002 10.4242 2.00388 9.88638C2.03714 9.60627 2.40248 9.3198 3.09992 9.02697Z"
                fill="currentColor"
            />
        </svg>
    ),
    discord: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path
                d="M16.5054 4.47543C14.9479 3.22203 12.4839 3.00957 12.3784 3.00192C12.2148 2.98817 12.0589 3.07988 11.9917 3.2312C11.9856 3.24038 11.9321 3.36419 11.8725 3.55678C12.9027 3.73103 14.1683 4.08107 15.3132 4.79184C15.4966 4.90495 15.5532 5.14646 15.44 5.32988C15.3651 5.45063 15.2383 5.51636 15.1068 5.51636C15.0365 5.51636 14.9647 5.49649 14.9005 5.45675C12.9317 4.23545 10.4738 4.17431 10 4.17431C9.52615 4.17431 7.06675 4.23545 5.09952 5.45675C4.9161 5.57139 4.67459 5.51483 4.56148 5.33141C4.44684 5.14646 4.5034 4.90648 4.68682 4.79184C5.83169 4.0826 7.09732 3.73103 8.12755 3.55831C8.06793 3.36419 8.01444 3.2419 8.00985 3.2312C7.94107 3.07988 7.78668 2.98511 7.6216 3.00192C7.51613 3.00957 5.05214 3.22203 3.47317 4.49224C2.64929 5.25498 1 9.71218 1 13.5656C1 13.6344 1.01834 13.7001 1.05197 13.7597C2.1892 15.7591 5.29365 16.2818 6.00136 16.3047C6.00442 16.3047 6.009 16.3047 6.01359 16.3047C6.13893 16.3047 6.25662 16.2451 6.32999 16.1442L7.04535 15.1599C5.11481 14.6616 4.12891 13.8148 4.07235 13.7643C3.91033 13.6222 3.89504 13.3745 4.03872 13.2125C4.18088 13.0505 4.4285 13.0352 4.59052 13.1774C4.61345 13.1988 6.42935 14.7395 10 14.7395C13.5768 14.7395 15.3927 13.1927 15.411 13.1774C15.573 13.0367 15.8191 13.0505 15.9628 13.2141C16.105 13.3761 16.0897 13.6222 15.9276 13.7643C15.8711 13.8148 14.8852 14.6616 12.9547 15.1599L13.67 16.1442C13.7434 16.2451 13.8611 16.3047 13.9864 16.3047C13.991 16.3047 13.9956 16.3047 13.9986 16.3047C14.7064 16.2818 17.8108 15.7591 18.948 13.7597C18.9817 13.7001 19 13.6344 19 13.5656C19 9.71218 17.3507 5.25498 16.5054 4.47543ZM7.45652 12.0004C6.6999 12.0004 6.08696 11.3003 6.08696 10.4352C6.08696 9.57003 6.6999 8.86996 7.45652 8.86996C8.21315 8.86996 8.82609 9.57003 8.82609 10.4352C8.82609 11.3003 8.21315 12.0004 7.45652 12.0004ZM12.5435 12.0004C11.7869 12.0004 11.1739 11.3003 11.1739 10.4352C11.1739 9.57003 11.7869 8.86996 12.5435 8.86996C13.3001 8.86996 13.913 9.57003 13.913 10.4352C13.913 11.3003 13.3001 12.0004 12.5435 12.0004Z"
                fill="currentColor"
            />
        </svg>
    ),
    right: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 16 17" {...getSize(16, 17, ratio)}>
            <path d="M5 2.75L11 8.75L5 14.75" stroke="currentColor" strokeWidth={1.6} />
        </svg>
    ),
    check: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 10 8" {...getSize(10, 8, ratio)}>
            <path d="M1.5 4L4 6.5L8.5 1" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    ),
    vCols: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 1L5 1L5 19H1L1 1ZM8 1L12 1L12 19H8V1ZM19 1L15 1L15 19H19V1Z"
                fill="currentColor"
            />
        </svg>
    ),
    hCols: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 1L19 1V5L1 5L1 1ZM1 8L19 8V12L1 12L1 8ZM19 15L1 15L1 19H19V15Z"
                fill="currentColor"
            />
        </svg>
    ),
    up: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path d="M4 13L10 7L16 13" stroke="currentColor" strokeWidth={1.6} />
        </svg>
    ),
    down: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path d="M16 7L10 13L4 7" stroke="currentColor" strokeWidth={1.6} />
        </svg>
    ),
    link: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.46447 7.32233L8.39341 6.25126L10.5355 4.10913C12.0144 2.63029 14.412 2.63029 15.8909 4.10913C17.3697 5.58796 17.3697 7.98562 15.8909 9.46446L13.7487 11.6066L12.6777 10.5355L14.8198 8.39339C15.7071 7.50609 15.7071 6.06749 14.8198 5.18019C13.9325 4.29289 12.4939 4.29289 11.6066 5.18019L9.46447 7.32233Z"
                fill="currentColor"
                fillOpacity="0.48"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.85787 13.2128L6.7868 12.1417L12.1421 6.78637L13.2132 7.85743L7.85787 13.2128Z"
                fill="currentColor"
                fillOpacity="0.48"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.5355 12.6773L11.6066 13.7484L9.46446 15.8905C7.98563 17.3693 5.58796 17.3693 4.10913 15.8905C2.63029 14.4117 2.63029 12.014 4.10913 10.5352L6.25126 8.39303L7.32233 9.4641L5.18019 11.6062C4.29289 12.4935 4.29289 13.9321 5.18019 14.8194C6.06749 15.7067 7.50609 15.7067 8.39339 14.8194L10.5355 12.6773Z"
                fill="currentColor"
                fillOpacity="0.48"
            />
        </svg>
    ),
    edit: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17 15.6V10.7001H15.6V15.6H4.40004V4.40011H9.30001V3.00012H4.40004C3.62684 3.00012 3.00004 3.62692 3.00004 4.40011V15.6C3.00004 16.3732 3.62684 17 4.40004 17H15.6C16.3732 17 17 16.3732 17 15.6ZM15.0246 3.50652C14.7038 3.18312 14.2644 3.00012 13.8061 3.00012C13.3483 3.00012 12.9095 3.1827 12.5868 3.50736L6.72857 9.36548C6.20509 9.82672 5.86193 10.5131 5.8023 11.2512L5.80003 13.5017V14.2017H8.69423C9.48824 14.1472 10.1813 13.8007 10.6703 13.2367L16.4953 7.41418C16.8184 7.09101 17 6.65269 17 6.19566C17 5.73862 16.8184 5.30031 16.4953 4.97714L15.0246 3.50652ZM8.6448 12.8035C9.01875 12.777 9.36685 12.6029 9.64636 12.2832L13.8897 8.03992L11.9617 6.11181L7.68729 10.3848C7.40368 10.6356 7.22824 10.9866 7.20002 11.3076V12.8021L8.6448 12.8035ZM12.9518 5.12203L14.8796 7.04997L15.5053 6.42425C15.5659 6.36363 15.6 6.28141 15.6 6.19568C15.6 6.10994 15.5659 6.02772 15.5053 5.9671L14.0328 4.49453C13.9728 4.43411 13.8912 4.40013 13.8061 4.40013C13.721 4.40013 13.6394 4.43411 13.5795 4.49453L12.9518 5.12203Z"
                fill="currentColor"
            />
        </svg>
    ),
    add: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 21 20" {...getSize(21, 20, ratio)}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.5 19.1673C5.43743 19.1673 1.33337 15.0633 1.33337 10.0007C1.33337 4.93804 5.43743 0.833984 10.5 0.833984C15.5626 0.833984 19.6667 4.93804 19.6667 10.0007C19.6667 15.0633 15.5626 19.1673 10.5 19.1673ZM10.5 17.5007C14.6422 17.5007 18 14.1428 18 10.0007C18 5.85851 14.6422 2.50065 10.5 2.50065C6.3579 2.50065 3.00004 5.85851 3.00004 10.0007C3.00004 14.1428 6.3579 17.5007 10.5 17.5007ZM14.6667 9.16732H11.3334V5.83398H9.66671V9.16732H6.33337V10.834H9.66671V14.1673H11.3334V10.834H14.6667V9.16732Z"
                fill="currentColor"
            />
        </svg>
    ),
    warning: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 64 64" {...getSize(64, 64, ratio)}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M59.8442 42.5425L41.1633 10.6076C39.2878 7.35638 35.7923 5.33842 32.0119 5.33399C28.2312 5.32957 24.7344 7.3392 22.8357 10.6078L4.14784 42.5543C2.21004 45.8126 2.1662 49.8954 4.04318 53.2252C5.92171 56.5577 9.43913 58.6316 13.2651 58.6627L50.6994 58.6629C54.5652 58.6253 58.0759 56.5578 59.9541 53.2282C61.8302 49.9026 61.7882 45.8288 59.8442 42.5425ZM8.74159 45.2638L27.4433 13.2937C28.3904 11.6634 30.1274 10.6651 32.0057 10.6673C33.8838 10.6695 35.6202 11.6719 36.5516 13.2866L55.2472 45.2467C56.2272 46.9033 56.2482 48.9427 55.3089 50.6078C54.3683 52.2752 52.6099 53.3108 50.6734 53.3297L13.2868 53.3295C11.3918 53.314 9.62997 52.2752 8.6892 50.6062C7.74946 48.9391 7.77141 46.8952 8.74159 45.2638ZM32.0009 47.9957C33.4742 47.9957 34.6685 46.8018 34.6685 45.3291C34.6685 43.8563 33.4742 42.6624 32.0009 42.6624C30.5277 42.6624 29.3334 43.8563 29.3334 45.3291C29.3334 46.8018 30.5277 47.9957 32.0009 47.9957ZM34.6764 21.3291H29.3413V39.9957H34.6764V21.3291Z"
                fill="currentColor"
            />
        </svg>
    ),
    success: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19Z"
                fill="#4AB44A"
                fillOpacity="0.32"
            />
            <path d="M5.5 9.55002L9.1 13.15L14.95 6.40002" stroke="#4AB44A" strokeWidth="1.8" />
        </svg>
    ),
    addAssetToWallet: ({ ratio, ...props }) => (
        <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.4645 11.4645C9.51184 13.4171 9.51184 16.5829 11.4645 18.5355C13.4171 20.4882 16.5829 20.4882 18.5355 18.5355C20.4882 16.5829 20.4882 13.4171 18.5355 11.4645C16.5829 9.51184 13.4171 9.51184 11.4645 11.4645ZM11.4645 16L14.2 15.8L14 18.5355H16L15.8 15.8L18.5355 16V14L15.8 14.2L16 11.5H14L14.2 14.2L11.4645 14V16Z"
                fill="currentColor"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1 4.66667C1 3.19391 2.20883 2 3.7 2H14.5C15.4941 2 16.3 2.79594 16.3 3.77778V3.82335H3.90769C3.29593 3.82335 2.8 4.31316 2.8 4.91737C2.8 5.52158 3.29593 6.01138 3.90769 6.01138H19V9.25399C16.2703 7.34904 12.486 7.61446 10.0503 10.0503C7.90012 12.2004 7.44115 15.4013 8.67333 18H3.7C2.20883 18 1 16.8061 1 15.3333V4.66667Z"
                fill="currentColor"
            />
        </svg>
    ),
    world: ({ ratio, ...props }) => {
        const clipPathId = uniqueKey()
        return (
            <svg {...defaultProps} {...props} viewBox="0 0 20 20" {...getSize(20, 20, ratio)}>
                <g clipPath={`url(#clip0_9417_${clipPathId})`}>
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.5 17.7942C18.8046 15.309 20.2795 9.80464 17.7942 5.50001C15.3089 1.19537 9.80463 -0.279501 5.49999 2.20578C1.19536 4.69106 -0.279517 10.1954 2.20576 14.5C4.69105 18.8046 10.1954 20.2795 14.5 17.7942ZM15.9699 5.29526C14.3627 3.25052 11.8464 2.21175 9.34483 2.42649C10.9803 3.24528 12.673 4.84228 14.0111 6.97063C14.8923 6.26328 15.5799 5.65231 15.9699 5.29526ZM2.94059 12.8178C1.97342 10.4035 2.33198 7.70489 3.76871 5.64586C3.66006 7.47164 4.19677 9.73603 5.37093 11.959C4.31775 12.3685 3.44483 12.6585 2.94059 12.8178ZM5.60134 3.98131C4.63681 5.38976 5.03831 8.41475 6.67319 11.4266C7.4851 11.0776 8.34889 10.6727 9.20079 10.2157L5.60134 3.98131ZM6.98698 3.18131L10.5864 9.41574C11.4081 8.90643 12.1906 8.36082 12.8988 7.83219C11.108 4.91044 8.689 3.05023 6.98698 3.18131ZM10.0008 11.6014C9.16093 12.0518 8.30951 12.4517 7.50764 12.7974C9.24539 15.3535 11.4367 16.9401 13.013 16.8187L10.0008 11.6014ZM14.3987 16.0187L11.3864 10.8014C12.1965 10.2993 12.9685 9.76187 13.6688 9.24026C15.0135 12.0232 15.2919 14.7143 14.3987 16.0187ZM3.68048 14.2223C4.17613 14.0669 5.08389 13.7678 6.18789 13.3381C7.49256 15.3122 9.09972 16.7948 10.6552 17.5735C7.96392 17.8046 5.25556 16.5847 3.68048 14.2223ZM16.8164 6.6383C18.0748 9.18357 17.777 12.139 16.2313 14.3542C16.3346 12.6178 15.8542 10.4846 14.7969 8.36766C15.7211 7.62645 16.434 6.98984 16.8164 6.6383Z"
                        fill="white"
                    />
                </g>
                <defs>
                    <clipPath id={`clip0_9417_${clipPathId}`}>
                        <rect width="20" height="20" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        )
    },
})

export default library

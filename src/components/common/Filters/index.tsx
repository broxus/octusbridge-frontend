import * as React from 'react'
import { useIntl } from 'react-intl'
import classNames from 'classnames'

import { Button } from '@/components/common/Button'
import { Popup } from '@/components/common/Filters/popup'
import { useDropdown } from '@/hooks/useDropdown'

import './index.scss'

export * from '@/components/common/Filters/date'
export * from '@/components/common/Filters/radio'
export * from '@/components/common/Filters/text'
export * from '@/components/common/Filters/field'
export * from '@/components/common/Filters/token'
export * from '@/components/common/Filters/check'

type Props<T> = {
    filters: T;
    block?: boolean;
    onChange: (filters: T) => void;
    children: (
        filters: T,
        change: (key: keyof T) => (value: T[keyof T]) => void,
    ) => React.ReactNode;
}

export function Filters<T extends {[k: string]: unknown}>({
    filters,
    block,
    onChange,
    children,
}: Props<T>): JSX.Element {
    const intl = useIntl()
    const filterDropdown = useDropdown()

    const [localFilters, setLocalFilters] = React.useState<T>(filters)

    const filtersCount = Object.values(filters).filter(item => item !== undefined).length

    const clearEnabled = filtersCount > 0

    const applyEnabled = Object.entries(localFilters)
        .some(([key, value]) => filters[key] !== value)

    const changeLocalFilter = (key: keyof T) => (
        (value: T[keyof T]) => {
            setLocalFilters(prev => ({ ...prev, [key]: value }))
        }
    )

    const apply = () => {
        onChange(localFilters)
    }

    const clear = () => {
        onChange({} as T)
    }

    React.useEffect(() => {
        setLocalFilters(filters)
    }, [filters])

    return (
        <div
            className={classNames('filters', {
                filters_block: block,
            })}
        >
            <div className="filters__filter">
                <Button
                    block={block}
                    type="secondary"
                    onClick={filterDropdown.open}
                >
                    {intl.formatMessage({
                        id: 'FILTERS_FILTER',
                    })}

                    {filtersCount > 0 && (
                        <span className="filters__counter">{filtersCount}</span>
                    )}
                </Button>

                {filterDropdown.visible && (
                    <div ref={filterDropdown.popupRef}>
                        <Popup
                            onApply={apply}
                            onClear={clear}
                            applyEnabled={applyEnabled}
                            clearEnabled={clearEnabled}
                        >
                            {children(localFilters, changeLocalFilter)}
                        </Popup>
                    </div>
                )}
            </div>
        </div>
    )
}

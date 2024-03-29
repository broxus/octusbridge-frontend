import * as React from 'react'
import { Observer } from 'mobx-react-lite'

import { Icon } from '@/components/common/Icon'
import { Component } from '@/components/common/Component'
import { Drawer, type DrawerRef } from '@/components/common/Drawer'
import { Logo } from '@/components/layout/Logo'
import { DeviceNav } from '@/components/layout/DeviceNav'
import { LangSwitcher } from '@/components/layout/LangSwitcher'
import { Wallets } from '@/components/layout/Wallets'

import './index.scss'

export function HeaderDrawer(): JSX.Element {
    const drawer = React.useRef<DrawerRef | null>(null)

    const collapse: VoidFunction = () => {
        drawer.current?.collapse()
    }

    React.useEffect(() => {
        // const connectionDisposer = reaction(() => wallet.isConnected, () => {
        //     collapse()
        // })
        // return () => {
        //     connectionDisposer?.()
        // }
    }, [])

    return (
        <Observer>
            {() => (
                <Drawer
                    ref={drawer}
                    closable
                    destroyOnClose
                    /* eslint-disable-next-line react/no-unstable-nested-components */
                    trigger={({ expand }) => (
                        <button
                            type="button"
                            className="btn btn--icon btn-open-drawer"
                            onClick={expand}
                        >
                            <Icon icon="menu" />
                        </button>
                    )}
                    width="100vw"
                >
                    <Component className="device-drawer-content-inner">
                        <div className="device-drawer-header">
                            <div className="logo">
                                <Logo ratio={0.9} />
                            </div>

                            <div className="device-drawer-header-inner">
                                <Wallets />
                                <button
                                    type="button"
                                    className="btn btn--icon btn-close-drawer"
                                    onClick={collapse}
                                >
                                    <Icon icon="close" />
                                </button>
                            </div>
                        </div>
                        <DeviceNav onNavigate={collapse} />
                        <LangSwitcher />
                    </Component>
                </Drawer>
            )}
        </Observer>
    )
}

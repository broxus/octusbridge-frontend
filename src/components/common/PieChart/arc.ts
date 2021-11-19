export function calcChartArc(
    startAngle: number,
    endAngle: number,
    outerRadius: number,
    innerRadius: number,
): string {
    const _startAngle = (startAngle * Math.PI) / 180
    const _endAngle = (endAngle * Math.PI) / 180
    const sinAlpha = Math.sin(_startAngle)
    const cosAlpha = Math.cos(_startAngle)
    const sinBeta = Math.sin(_endAngle)
    const cosBeta = Math.cos(_endAngle)
    const largeArc = _endAngle - _startAngle > Math.PI

    const P = {
        x: outerRadius + outerRadius * sinAlpha,
        y: outerRadius - outerRadius * cosAlpha,
    }

    const Q = {
        x: outerRadius + outerRadius * sinBeta,
        y: outerRadius - outerRadius * cosBeta,
    }

    const R = {
        x: outerRadius + innerRadius * sinBeta,
        y: outerRadius - innerRadius * cosBeta,
    }

    const S = {
        x: outerRadius + innerRadius * sinAlpha,
        y: outerRadius - innerRadius * cosAlpha,
    }

    return `M${P.x}, ${P.y} A${outerRadius},${outerRadius} 0 ${
        largeArc ? '1' : '0'
    } 1 ${Q.x},${Q.y} L${R.x},${R.y} A${innerRadius},${innerRadius} 0 ${
        largeArc ? '1' : '0'
    } 0 ${S.x},${S.y} Z`
}

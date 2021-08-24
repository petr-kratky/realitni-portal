type Type = 'currency' | 'default'

export function formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat('cs-CZ', options).format(number)
}
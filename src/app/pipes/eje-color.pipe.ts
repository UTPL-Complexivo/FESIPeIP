import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ejeColor',
    standalone: true
})
export class EjeColorPipe implements PipeTransform {
    private colorMap: { [key: string]: { class: string, hex: string } } = {
        'Social': { class: 'bg-violet-500', hex: '#8b5cf6' },
        'Desarrollo Económico': { class: 'bg-teal-500', hex: '#14b8a6' },
        'Infraestructura, Energia y Medio Ambiente': { class: 'bg-sky-500', hex: '#0ea5e9' },
        'Institucional': { class: 'bg-indigo-500', hex: '#6366f1' },
        'Gestión de Riesgos': { class: 'bg-yellow-500', hex: '#eab308' }
    };

    transform(eje: string, type: 'background' | 'text' | 'hex' = 'background'): string {
        const colorInfo = this.colorMap[eje] || { class: 'bg-gray-500', hex: '#6b7280' };

        if (type === 'hex') {
            return colorInfo.hex;
        } else if (type === 'background') {
            return colorInfo.class;
        } else {
            // Para colores de texto, convertir bg- a text-
            return colorInfo.class.replace('bg-', 'text-');
        }
    }
}

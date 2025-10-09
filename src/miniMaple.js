class MiniMaple {
    validate(input) {
        if (!input || typeof input !== 'string')
            return { valid: false, error: 'Пустой ввод' };

        const parts = input.split(',').map(s => s.trim());
        if (parts.length !== 2)
            return { valid: false, error: 'Формат: "выражение, переменная"' };

        const [expression, variable] = parts;
        
        if (!/^[a-zA-Z]$/.test(variable))
            return { valid: false, error: 'Переменная должна быть одной буквой' };

        if (!/^[a-zA-Z0-9+\-*^\s.]+$/.test(expression))
            return { valid: false, error: 'Недопустимые символы в выражении' };

        return { valid: true, expression, variable };
    }

    differentiate(input) {
        const validation = this.validate(input);
        if (!validation.valid)
            return validation.error

        const { expression, variable } = validation;
        
        const terms = this.parseTerms(expression);
        
        const derivatives = terms.map(term => this.differentiateTerm(term, variable));
        
        const simplified = this.simplify(derivatives, variable);
        
        return simplified;
    }

    parseTerms(expression) {
        const terms = [];
        let current = '';
        
        for (let i = 0; i < expression.length; i++) {
            const char = expression[i];
            
            if ((char === '+' || char === '-') && i > 0) {
                terms.push(current.trim());
                current = char === '-' ? '-' : '';
            } else
                current += char;
        }
        
        if (current) terms.push(current.trim());
        return terms.filter(t => t.length > 0);
    }

    differentiateTerm(term, variable) {
        term = term.trim();
        
        if (/^-?\d+\.?\d*$/.test(term))
            return { coefficient: 0, power: 0 };
        
        const factors = this.parseFactors(term);
        
        return this.productRule(factors, variable);
    }

    parseFactors(term) {
        const factors = [];
        let current = '';
        
        for (let i = 0; i < term.length; i++) {
            const char = term[i];
            
            if (char === '*') {
                if (current.trim()) factors.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        if (current.trim()) factors.push(current.trim());
        return factors;
    }

    productRule(factors, variable) {
        if (factors.length === 0) return { coefficient: 0, power: 0 };
        
        let coefficient = 1;
        let power = 0;
        let hasVariable = false;
        
        for (const factor of factors) {
            const parsed = this.parseFactor(factor, variable);
            coefficient *= parsed.coefficient;
            power += parsed.power;
            hasVariable = hasVariable || parsed.hasVariable;
        }
        
        if (!hasVariable) {
            return { coefficient: 0, power: 0 };
        }
        
        return {
            coefficient: coefficient * power,
            power: power - 1
        };
    }

    parseFactor(factor, variable) {
        factor = factor.trim();
        
        const num = parseFloat(factor);
        if (!isNaN(num) && factor === num.toString())
            return { coefficient: num, power: 0, hasVariable: false };
        
        const powerMatch = factor.match(new RegExp(`^(-?\\d*\\.?\\d*)\\*?${variable}\\^(-?\\d+)$`));
        if (powerMatch) {
            const coef = powerMatch[1] === '' || powerMatch[1] === '-' 
                ? (powerMatch[1] === '-' ? -1 : 1)
                : parseFloat(powerMatch[1]);
            return {
                coefficient: coef,
                power: parseInt(powerMatch[2]),
                hasVariable: true
            };
        }
        
        const varMatch = factor.match(new RegExp(`^(-?\\d*\\.?\\d*)\\*?${variable}$`));
        if (varMatch) {
            const coef = varMatch[1] === '' || varMatch[1] === '-'
                ? (varMatch[1] === '-' ? -1 : 1)
                : parseFloat(varMatch[1]);
            return {
                coefficient: coef,
                power: 1,
                hasVariable: true
            };
        }
        
        if (!factor.includes(variable)) {
            const coef = parseFloat(factor);
            return {
                coefficient: isNaN(coef) ? 1 : coef,
                power: 0,
                hasVariable: false
            };
        }
        
        return { coefficient: 1, power: 1, hasVariable: true };
    }

    simplify(derivatives, variable) {
        const grouped = {};
        
        for (const derivative of derivatives) {
            if (derivative.coefficient === 0) continue;
            
            const power = derivative.power || 0;
            if (!grouped[power]) {
                grouped[power] = 0;
            }
            grouped[power] += derivative.coefficient;
        }
        
        const terms = [];
        const powers = Object.keys(grouped).map(Number).sort((a, b) => b - a);
        
        for (const power of powers) {
            const coef = grouped[power];
            if (Math.abs(coef) < 1e-10) continue;
            
            terms.push(this.formatTerm(coef, power, variable));
        }
        
        if (terms.length === 0) return '0';
        
        return terms.join(' ')
            .replace(/\+ -/g, '- ')
            .replace(/^\+ /, '');
    }

    formatTerm(coefficient, power, variable) {
        const sign = coefficient >= 0 ? '+ ' : '- ';
        const absCoef = Math.abs(coefficient);
        
        if (power === 0) {
            return `${sign}${absCoef}`;
        } else if (power === 1) {
            if (absCoef === 1) {
                return `${sign}${variable}`;
            }
            return `${sign}${absCoef}*${variable}`;
        } else {
            if (absCoef === 1) {
                return `${sign}${variable}^${power}`;
            }
            return `${sign}${absCoef}*${variable}^${power}`;
        }
    }
}

export { MiniMaple }

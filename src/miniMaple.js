class Term {
    constructor(coefficient = 1, variable = null, power = 0) {
        this.coefficient = coefficient;
        this.variable = variable;
        this.power = power;
    }

    differentiate(variable) {

        if (this.variable !== variable)
            return new Term(0, null, 0);
        
        if (this.power === 0)
            return new Term(0, null, 0);
        
        if (this.power === 1)
            return new Term(this.coefficient, null, 0);
        
        const newCoeff = this.coefficient * this.power;
        const newPower = this.power - 1;
        
        return new Term(newCoeff, variable, newPower);
    }
    
    isSimilar(other) {
        return this.variable === other.variable && this.power === other.power;
    }
    
    add(other) {
        if (!this.isSimilar(other)) {
            throw new Error('Нельзя складывать неподобные термы');
        }
        return new Term(
            this.coefficient + other.coefficient,
            this.variable,
            this.power
        );
    }
    
    toString(useAbsoluteValue = false) {

        if (this.coefficient === 0)
            return '0';
        
        const coeff = useAbsoluteValue ? Math.abs(this.coefficient) : this.coefficient;
        
        if (!this.variable || this.power === 0)
            return coeff.toString();
        
        let result = '';
        
        result = coeff.toString() + '*';
        
        result += this.variable;
        
        if (this.power !== 1)
            result += '^' + this.power;
        
        return result;
    }
}

class MiniMaple {
    
    parseExpression(expression, variable) {
        const terms = [];
        
        let current = '';
        let sign = 1;
        
        for (let i = 0; i < expression.length; i++) {
            const char = expression[i];
            
            if (char === '+' || char === '-') {
                if (current.trim()) {
                    terms.push(this.parseTerm(current.trim(), variable, sign));
                    current = '';
                }
                sign = char === '+' ? 1 : -1;
            } else if (char !== ' ')
                current += char;
        }
        
        if (current.trim())
            terms.push(this.parseTerm(current.trim(), variable, sign));
        
        return terms;
    }
    
    parseTerm(termStr, variable, sign) {
        termStr = termStr.trim();
        
        let coefficient = sign;
        let power = 0;
        let hasVariable = termStr.includes(variable);
        
        if (!hasVariable) {
            coefficient = sign * parseFloat(termStr);
            return new Term(coefficient, null, 0);
        }
        
        const parts = termStr.split(variable);
        
        if (parts[0]) {
            const coeffStr = parts[0].replace(/\*/g, '').trim();
            if (coeffStr && coeffStr !== '+' && coeffStr !== '-')
                coefficient = sign * parseFloat(coeffStr);
        }
        
        if (parts[1]) {
            const powerPart = parts[1].trim();
            if (powerPart.startsWith('^'))
                power = parseFloat(powerPart.substring(1));
            else
                power = 1;
        } else
            power = 1;
        
        return new Term(coefficient, variable, power);
    }
    
    combineTerms(terms) {
        const combined = [];
        
        for (const term of terms) {
            if (term.coefficient === 0)
                continue;
            
            let found = false;
            for (let i = 0; i < combined.length; i++) {
                if (combined[i].isSimilar(term)) {
                    combined[i] = combined[i].add(term);
                    found = true;
                    break;
                }
            }
            
            if (!found)
                combined.push(term);
        }
        
        const filtered = combined.filter(t => t.coefficient !== 0);
        
        filtered.sort((a, b) => b.power - a.power);
        
        return filtered;
    }
    
    termsToString(terms) {
        if (terms.length === 0)
            return '0';
        
        let result = '';
        
        for (let i = 0; i < terms.length; i++) {
            if (i === 0)
                result = terms[i].toString();
            else {
                if (terms[i].coefficient < 0)
                    result += ' - ' + terms[i].toString(true);
                else
                    result += ' + ' + terms[i].toString();
            }
        }
        
        return result;
    }
    
    differentiate(input) {
        const validation = this.validate(input);
        if (!validation.valid)
            return validation.error;
        
        const parts = input.split(',').map(s => s.trim());
        const [expression, variable] = parts;
        
        const terms = this.parseExpression(expression, variable);
        
        const diffTerms = terms.map(term => term.differentiate(variable));
        
        const combined = this.combineTerms(diffTerms);
        
        return this.termsToString(combined);
    }
    
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


        return { valid: true };
    }
}


export { MiniMaple }

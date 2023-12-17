// les tableaux des lettres
const ALPHABETICAL = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]
// le nombre de lettre dans l'alphabet
const ALPHABETICAL_SIZE = 26

// indexer de la valeur space (espace)
const SPACE_SIZE = 30

const SPACE_VALUE = ' '


/**
 * Récupèrer les réferences de chaque lettre dans le tableau de ALPHA
 * 
 * @param {string} t
 * @returns {integer[]}
 */
const toIndexer = (t) => {
    const references = []
    for (let index = 0; index < t.length; index++) {
        const indexer = t[index]
        const reference = ALPHABETICAL.indexOf(indexer);
        if (reference >= 0){
            references.push(reference)
        } else if (reference < 0 && indexer === SPACE_VALUE) {
            references.push(SPACE_SIZE)
        }
    }
    return references
}

/**
 * Récupèrer les lettre de chaque réference dans le tableau de ALPHABETICAL
 * 
 * @param {integer[]} ts
 * @returns {string[]}
 */
const toLetter = (ts) => {
    const letters = []
    ts.forEach(t => t === SPACE_SIZE ? letters.push(SPACE_VALUE) : letters.push(ALPHABETICAL[t]))
    return letters
}

/**
 * Permet de convertir le tableau de reference en chaine de caractère
 * 
 * @param {integer[]|string[]} arr 
 * @param {string} separator 
 * @returns {string}
 */
const toJoin = (arr, separator = '') => arr.join(separator)

/**
 * 
 * @param {integer|integer[]} indexer 
 * @param {integer} operator 
 * @returns {integer}
 */
const toSpace = (indexer, operator) => {
    if (Array.isArray(indexer) && indexer instanceof Array) {
        return indexer.indexOf(SPACE_SIZE) < 0 ? operator : SPACE_SIZE
    }
    return indexer ==  SPACE_SIZE ? SPACE_SIZE : operator
}

/**
 * 
 * @param {string} t  la chaine 
 * @param {string} k la clé 
 * @returns {{keyIndexer: string[], targetIndexer: string[]}}
 */
const toCompleted = (t, k) => {
    const keyIndexer = k.toUpperCase().split('')
    const targetIndexer = t.toUpperCase().replace().split('')

    let index = 0
    while (targetIndexer.length !== keyIndexer.length) {
        const element = k[index]
        if (element) {
            keyIndexer.push(element.toUpperCase())
        }

        if (index === (k.length - 1)) {
            index = 0
            continue
        }
        index++
    }
    return {keyIndexer: toIndexer(toJoin(keyIndexer)), targetIndexer: toIndexer(toJoin(targetIndexer))}
}

/**
 * Permet d'eliminer la valeur négative
 * @param {integer} n le nombre nevative
 * @returns {integer}
 */
const toNegative = (n) => n < 0 ? n + ALPHABETICAL_SIZE : n

/**
 * 
 * @param {integer} a 
 * @param {integer} b 
 * @returns 
 */
const modularReverse = (a, b) => {
    const extended = euclideExtended(a, b)
    return a > b ? extended.T1 : extended.S1
}

/**
 * Permet de trouver le PGCD entre A et B avec l'algorithme d'euclide étendu
 * 
 * @param {integer} a la valeur de A
 * @param {integer} b la valeur de B
 * @returns {{S1: integer, T1: integer, a: integer}}
 */
const euclideExtended = (a, b) => {
    let S1 = 1, S2 = 0, T1 = 0, T2 = 1
    while (b !== 0) {
        const q = parseInt(a / b), r = a - q * b
        let S = S1 - q * S2, T = T1 - q * T2
        a = b, b = r
        S1 = S2, S2 = S
        T1 = T2, T2 = T
    }
    return {S1, T1, a}
}

/**
 * Permet de chiffrer ou dechiffrer une chaine en utilisant l'algorithme de chiffrement de cesar
 * 
 * @param {string} target la chaine de chiffrer ou dechiffrer
 * @param {integer} key la clé de chiffrer
 * @param {boolean} state l'action à faire
 * @returns {string} la nouvelle chaine 
 */
const cesar = (target, key, state = true) => {
    const indexers = toIndexer(target.toUpperCase())
    const cesars = []
    state 
        ? indexers.forEach(index => cesars.push(toSpace(index, ((index + key) % ALPHABETICAL_SIZE))))
        : indexers.forEach(index => cesars.push(toSpace(index, toNegative((index - key) % ALPHABETICAL_SIZE))))
    
    return toJoin(toLetter(cesars))
}

/**
 * Permet de chiffrer ou dechiffrer une chaine en utilisant l'algorithme de chiffrement d'affine
 * 
 * @param {string} target la chaine de chiffrer ou dechiffrer
 * @param {integer} k1 la clé 1 de chiffrer
 * @param {integer} k2 la clé 2 de chiffrer
 * @param {boolean} state 
 */
const affine = (target, k1, k2, state = true) => {
    const indexers = toIndexer(target.toUpperCase())
    const affines = []
    if (state) {
        indexers.forEach(index =>  affines.push((toSpace(index,(index * k1 + k2) % ALPHABETICAL_SIZE))))
    } else {
        indexers.forEach(index => {
            const rv = toNegative(modularReverse(k1, ALPHABETICAL_SIZE))
            affines.push(toSpace(index, toNegative(((index - k2) * rv) % ALPHABETICAL_SIZE)))
        })
    }
    return toJoin(toLetter(affines))
}


/**
 * @param {string} t 
 * @param {string} key 
 */
const vigenere = (t, key, state = true) => {
    if (key.length > t.length) throw new Error("la taille de la clé doit être inférieur à la taille du mot.")
    const {keyIndexer, targetIndexer} = toCompleted(t, key)
    const vigenere = []
    state 
        ? targetIndexer.forEach((c, index) => {
            const k = keyIndexer[index];
            vigenere.push(toSpace([c, k], (c + k) % ALPHABETICAL_SIZE))
        })
        : targetIndexer.forEach((c, index) => {
            const k = keyIndexer[index];
            vigenere.push(toSpace([c, k], toNegative((c - k) % ALPHABETICAL_SIZE)))
        })

    return toJoin(toLetter(vigenere))
}


// HORS ALGORITHME

const REGEX_TEXT = "^[a-zA-Z ]+$"
const REGEX_NUMBER = "^[0-9]+$"
const MESSAGE_REGEX = "contient d'autres caractères que des lettres ou des espaces."
const MESSAGE_EMPTY = " est obligatoire."
const MESSAGE_REGEX_NUMBER = "contient d'autres caractères que des nombres"
const MESSAGE_POSITIVE = "doit être dans l'intervalle de [1 - 25]"
const MESSAGE_POSITIVE_MAX = "doit être dans l'intervalle de [1 - N]"
const MESSAGE_PRIME = `Message d'erreur : Ceci est dû au 
    fait que la première clé n'est pas premier avec ${ALPHABETICAL_SIZE}, 
    or a et b sont premier ssi pgcd(a, b) = 1`

const cesarElement = document.querySelector('#cesar')
if (cesarElement) {
    const cesarInput = cesarElement.querySelector('#c-text')
    const cesarKey = cesarElement.querySelector('#c-key')
    const cesarButton = cesarElement.querySelector('#c-button')
    const cesarOutputCp = cesarElement.querySelector('#c-cp-output')
    const cesarOutputDcp = cesarElement.querySelector('#c-dcp-output')

    if (cesarInput, cesarKey, cesarButton, cesarOutputCp, cesarOutputDcp) {

        /**
         * 
         * @param {HTMLTextAreaElement} input 
         * @param {HTMLInputElement} key 
         */
        const onRuleCesar = (input, key) => {
            const c = input.value, k = key.value
            const errors = []
            if (c === '') {
                errors.push(`le texte ${MESSAGE_EMPTY}`)
            } else {
                if (!c.match(REGEX_TEXT)) {
                    errors.push(`le texte ${MESSAGE_REGEX}`)
                }
            } 
            if (k == '') {
                errors.push(`la clé ${MESSAGE_EMPTY}`)
            } else {
                if (!k.match(REGEX_NUMBER)) {
                    errors.push(`la clé ${MESSAGE_REGEX_NUMBER}`)
                } else {
                    const kInteger = parseInt(k)
                    if (kInteger <= 0 || kInteger > ALPHABETICAL_SIZE - 1) errors.push(`la clé ${MESSAGE_POSITIVE}`)
                }
            }
            if (errors.length === 0) {
                return true
            }
            alert(errors.join('\n'))

            return false
        }


        /**
         * @param {Event} e 
         */
        const onCesar = (e) => {
            const valid = onRuleCesar(cesarInput, cesarKey)
            if (valid) {
                const c = cesarInput.value, k = parseInt(cesarKey.value)
                const cp = cesar(c, k)
                cesarOutputCp.innerText = cp
                cesarOutputDcp.innerText = cesar(cp, k, false)
            }
        }

        cesarButton.addEventListener('click', onCesar)


    }
}


const affineElement = document.querySelector('#affine')
if (affineElement) {
    const affineInput = affineElement.querySelector('#a-text')
    const affineKeyOne = affineElement.querySelector('#a-key-1')
    const affineKeyTwo = affineElement.querySelector('#a-key-2')
    const affineButton = affineElement.querySelector('#a-button')
    const affineOutputCp = affineElement.querySelector('#a-cp-output')
    const affineOutputDcp = affineElement.querySelector('#a-dcp-output')

    if (affineInput, affineKeyOne, affineKeyTwo, affineButton, affineOutputCp, affineOutputDcp) {

        /**
         * @param {string} c 
         * @param {string} k1 
         * @param {string} k2 
         */
        const onRuleAffine = (c, k1, k2) => {
            const errors = []
            if (c === '') {
                errors.push(`le texte ${MESSAGE_EMPTY}`)
            } else {
                if (!c.match(REGEX_TEXT)) {
                    errors.push(`le texte ${MESSAGE_REGEX}`)
                }
            } 

            if (k1 == '') {
                errors.push(`la première clé ${MESSAGE_EMPTY}`)
            } else {
                if (!k1.match(REGEX_NUMBER)) {
                    errors.push(`la première clé ${MESSAGE_REGEX_NUMBER}`)
                } else {
                    const kInteger = parseInt(k1)
                    if (kInteger <= 0 || kInteger > ALPHABETICAL_SIZE - 1) {
                        errors.push(`la première clé ${MESSAGE_POSITIVE}`)
                    } 
                    else {
                        const pgcd = euclideExtended(ALPHABETICAL_SIZE, kInteger)
                        if (!(pgcd.a === 1)) {
                            errors.push(MESSAGE_PRIME)
                        }
                    }
                }
            }

            if (k2 == '') {
                errors.push(`la deuxième clé ${MESSAGE_EMPTY}`)
            } else {
                if (!k2.match(REGEX_NUMBER)) {
                    errors.push(`la deuxième clé ${MESSAGE_REGEX_NUMBER}`)
                } else {
                    const kInteger = parseInt(k2)
                    if (kInteger <= 0) errors.push(`la deuxième clé ${MESSAGE_POSITIVE_MAX}`)
                }
            }

            if (errors.length === 0) {
                return true
            }

            alert(errors.join('\n'))

            return false
        }


        /**
         * @param {Event} e 
         */
        const onAffine = (e) => {
            const valid = onRuleAffine(affineInput.value, affineKeyOne.value, affineKeyTwo.value)
            if (valid) {
                const c = affineInput.value, k1 = parseInt(affineKeyOne.value),  
                k2 = parseInt(affineKeyTwo.value)

                const cp = affine(c, k1, k2)
                affineOutputCp.innerText = cp
                affineOutputDcp.innerText = affine(cp, k1, k2, false)
            }
        }

        affineButton.addEventListener('click', onAffine)


    }
}


const vigenereElement = document.querySelector('#vigenere')
if (vigenereElement) {
    const vigenereInput = vigenereElement.querySelector('#v-text')
    const vigenereKey = vigenereElement.querySelector('#v-key')
    const vigenereButton = vigenereElement.querySelector('#v-button')
    const vigenereOutputCp = vigenereElement.querySelector('#v-cp-output')
    const vigenereOutputDcp = vigenereElement.querySelector('#v-dcp-output')

    if (vigenereInput, vigenereKey, vigenereButton, vigenereOutputCp, vigenereOutputDcp) {

        /**
         * 
         * @param {HTMLTextAreaElement} input 
         * @param {HTMLInputElement} key 
         */
        const onRuleVigenere = (input, key) => {
            const c = input.value, k = key.value
            const errors = []
            if (c === '') {
                errors.push(`le texte ${MESSAGE_EMPTY}`)
            } else {
                if (!c.match(REGEX_TEXT)) {
                    errors.push(`le texte ${MESSAGE_REGEX}`)
                }
            } 
            if (k == '') {
                errors.push(`la clé ${MESSAGE_EMPTY}`)
            } else {
                if (!c.match(REGEX_TEXT)) {
                    errors.push(`la clé ${MESSAGE_REGEX}`)
                } else {
                    if (k.length > c.length) {
                        errors.push("la clé doit avoir moins de caractère que le texte")
                    }
                }
            }

            if (errors.length === 0) {
                return true
            }

            alert(errors.join('\n'))

            return false
        }


        /**
         * @param {Event} e 
         */
        const onVigenere = (e) => {
            const valid = onRuleVigenere(vigenereInput, vigenereKey)
            if (valid) {
                const c = vigenereInput.value, k = vigenereKey.value
                const cp = vigenere(c, k)
                vigenereOutputCp.innerText = cp
                vigenereOutputDcp.innerText = vigenere(cp, k, false)
            }
        }
        vigenereButton.addEventListener('click', onVigenere)
    }
}
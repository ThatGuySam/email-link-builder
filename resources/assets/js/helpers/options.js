import is from 'is_js'
import {local} from 'brownies'

// const options = [
//     'usingMailtoTools'
// ]

export const getOption = (optionName) => {
    // If options is not set up yet initialize it
    if (is.not.object(local.options)) {
        local.options = {}
    }

    const localOptions = local.options
    
    if (is.not.propertyDefined(localOptions, optionName)) return null
    
    return local.options[optionName]
}

export const setOption = (optionName, value) => {
    // If options is not set up yet initialize it
    if (is.not.object(local.options)) {
        local.options = {}
    }

    local.options = {
        ...local.options,
        [optionName]: value
    }

    return local.options
}
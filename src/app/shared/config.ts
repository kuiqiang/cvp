import {trigger, state, style, transition, animate} from "@angular/core";

export const CONFIG = {
    META: {
        BRAND: "Crossover Video Portal"
    },
    SETTINGS: {
        LAZY_LOAD_BATCH_SIZE: 10
    },
    ANIMATIONS: {
        FADE_IN: [
            trigger("fadeIn", [
                state("in", style({
                    opacity: 1
                })),
                transition("void => *", [
                    style({opacity: 0}),
                    animate(450)
                ]),
                transition("* => void", [
                    animate(450, style({opacity: 0}))
                ])
            ])
        ]
    }
};

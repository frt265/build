



/obj/item/bombcore/nukie
	adminlog = null
	range_heavy = 16
	range_medium = 66
	range_light = 166
	range_flame = 16
	icon = 'icons/obj/antags/syndicate_tools.dmi'
	icon_state = "plutonium_core"


/obj/machinery/syndicatebomb/gaster

	name = "heavy Mike"
	desc = "Damn it..."
	payload = /obj/item/bombcore/nukie
	open_panel = TRUE
	timer_set = 666

	icon = 'mods/depths/icons/obj/heavymike.dmi'
	icon_state = "mike"

/obj/item/reagent_containers/cup/soup_pot/tea

	desc = "It's filled with tea... you can't see the bottom."

	volume = 6666666
	list_reagents = list(/datum/reagent/consumable/tea = 6666666)
	possible_transfer_amounts = list(6, 16, 66, 666)


/obj/item/clothing/mask/gas/sexymime/gaster
	name = "mask?"
	desc = "very, very interesting."
	icon = 'mods/depths/icons/obj/clothing/gaster.dmi'
	icon_state = "gaster"
	worn_icon = 'mods/depths/icons/mob/clothing/gaster.dmi'
	worn_icon_state = "gaster"

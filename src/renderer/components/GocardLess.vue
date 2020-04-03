<template>
    <div>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <div class="columns mx-auto w-12/12">
                    <div v-if="apiKey">
                        <div class="text-gray-700 text-base mb-2">Ajouter des factures</div>
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                @click="selectFilePlease()">Choisir un fichier
                        </button>
                        <div class="mt-8 w-6/12">
                            <div class="p-2 bg-blue-500 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex"
                                 role="alert">
                                <span class="flex rounded-full bg-blue-200 uppercase px-2 py-1 text-xs font-bold mr-3 text-black">{{invoices.length}}</span>
                                <span class="font-semibold mr-2 text-left flex-auto">Facture(s) en attente</span>
                            </div>
                        </div>
                    </div>
                </div>


                <h3 class="text-gray-800 font-bold text-md my-6">Gocardless</h3>
                <div class="items">
                    <div class="item">
                        <div class="value mx-3">{{customers.length}}</div>
                        <div class="name"> Comptes client</div>
                    </div>
                    <div class="item">
                        <div class="value mx-3">{{mandates.length}}</div>
                        <div class="name">Mandats</div>
                    </div>
                </div>
                <div class="mt-6" v-if="!apiKey">
                    <input type="text" v-model="apiKeyToTest"
                           class="shadow appearance-none border rounded w-4/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           name="apikey" value="" placeholder="Clé API">
                    <button @click="setApiKey()"
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Valider
                    </button>
                    <p class="text-sm text-gray-600 flex items-center">La clé se trouve dans l'espace client
                        Gocardless</p>
                </div>
                <div class="w-12/12">
                    <h4 v-if="customers.length" class="text-gray-800 font-bold text-xs my-6">Clients</h4>
                    <table class="table-auto" v-if="customers.length">
                        <thead>
                        <tr>
                            <th class="px-4 py-2 text-gray-700 text-base">Email</th>
                            <th class="px-4 py-2 text-gray-700 text-base">Id</th>
                            <th class="px-4 py-2 text-gray-700 text-base">Société</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="customer in customers" :key="customer.id">
                            <td class="border px-4 py-2 text-gray-700 text-base">{{customer.email}}</td>
                            <td class="border px-4 py-2 text-gray-700 text-base">{{customer.id}}</td>
                            <td class="border px-4 py-2 text-gray-700 text-base">{{customer.company_name}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <h4 v-if="invoices.length" class="text-gray-800 font-bold text-md my-6">Factures</h4>

                <table class="table-fixed text-center" v-if="invoices.length">
                    <thead>
                    <tr>
                        <th class="w-1/2 px-4 py-2 text-gray-700 text-base">Prix</th>
                        <th class="w-1/2 px-4 py-2 text-gray-700 text-base">Facture</th>
                        <th class="w-1/2 px-4 py-2 text-gray-700 text-base">Mandat</th>
                        <th class="w-1/2 px-4 py-2 text-gray-700 text-base">Statut</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="invoice in invoices" :key="invoices.invoice_number">
                        <td class="border px-4 py-2 text-gray-700 text-base" v-if="invoice.invoice_number">
                            {{invoice.price / 100}} €
                        </td>
                        <td class="border px-4 py-2 text-gray-700 text-base" v-if="invoice.invoice_number">
                            {{invoice.invoice_number}}
                        </td>
                        <td class="border px-4 py-2 text-gray-700 text-base" v-if="invoice.invoice_number">
                            {{invoice.psp_account_id}}
                        </td>
                        <td class="border px-4 py-2 text-gray-700 text-base"
                            v-if="invoice.invoice_number && mandates.some(e => e.id === invoice.psp_account_id)">
                            <svg class="fill-current h-6 w-6 text-green-500" viewBox="0 0 20 20">
                                <path d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
                            </svg>
                        </td>
                        <td class="border px-4 py-2 text-gray-700 text-base"
                            v-if="invoice.invoice_number && !mandates.some(e => e.id === invoice.psp_account_id)">
                            <svg class="fill-current h-6 w-6 text-red-500" role="button"
                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"></path>
                            </svg>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <div v-if="invoices.length" class="mt-8">
                    <div class="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3" role="alert"
                         v-if="canFire">
                        <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/>
                        </svg>
                        <p>Les mandats sont valides, on peut lancer</p>
                    </div>
                    <button v-if="canFire"
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                            @click="fire()">Lancer les paiements
                    </button>

                    <h4 v-if="validated.length" class="text-gray-800 font-bold text-md my-6">Traitées</h4>

                    <table class="table-fixed text-center" v-if="validated.length">
                        <thead>
                        <tr>
                            <th class="w-1/2 px-4 py-2 text-gray-700 text-base">Prix</th>
                            <th class="w-1/2 px-4 py-2 text-gray-700 text-base">Facture</th>
                            <th class="w-1/2 px-4 py-2 text-gray-700 text-base">Mandat</th>
                            <th class="w-1/2 px-4 py-2 text-gray-700 text-base">Statut</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="invoice in validated" :key="invoice.invoice_number">
                            <td class="border px-4 py-2 text-gray-700 text-base" v-if="invoice.invoice_number">
                                {{invoice.price / 100}} €
                            </td>
                            <td class="border px-4 py-2 text-gray-700 text-base" v-if="invoice.invoice_number">
                                {{invoice.invoice_number}}
                            </td>
                            <td class="border px-4 py-2 text-gray-700 text-base" v-if="invoice.invoice_number">
                                {{invoice.psp_account_id}}
                            </td>
                            <td class="border px-4 py-2 text-gray-700 text-base">
                                <svg class="fill-current h-6 w-6 text-green-500" viewBox="0 0 20 20">
                                    <path d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
                                </svg>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <div role="alert" v-if="!canFire">
                        <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                            Oups
                        </div>
                        <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                            <p>Il faut vérifier les mandats. L'un d'entre eux dans la liste des factures n'existe pas
                                sur le compte</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
  import {remote} from 'electron'
  import fs from 'fs'
  import Papa from 'papaparse'

  export default {
    name: 'GocardLess',
    data () {
      return {
        apiKey: null,
        apiKeyToTest: null,
        customers: [],
        mandates: [],
        invoices: [],
        validated: [],
        env: null
      }
    },
    mounted () {
      this.env = process.env.NODE_ENV === 'production' ? 'LIVE' : 'SANDBOX'
    },
    computed: {
      canFire () {
        const ok = this.invoices.filter(invoice => invoice.psp_account_id)
          .map(invoice => this.mandates.some(e => e.id === invoice.psp_account_id))
        return !(ok.filter(status => status === false).length > 0)
      }
    },
    methods: {
      async fire () {
        const gocardless = require('gocardless-nodejs')
        let client = gocardless(
          this.apiKey,
          this.env
        )
        for (const invoice of this.invoices) {
          if (invoice.psp_account_id) {
            try {
              await client.payments.create(
                {
                  amount: invoice.price,
                  currency: 'EUR',
                  links: {
                    mandate: invoice.psp_account_id
                  },
                  metadata: {
                    invoice_number: invoice.invoice_number
                  }
                }
              )
              this.validated.push(invoice)
            } catch (e) {
              console.log(e)
            }
          }
        }
      },
      async getCustomers () {
        if (this.apiKey) {
          const gocardless = require('gocardless-nodejs')
          const client = gocardless(
            this.apiKey,
            this.env
          )
          const listCustomersResponse = await client.customers.list()
          this.customers = listCustomersResponse.customers
          const listMandatesResponse = await client.mandates.list()
          this.mandates = listMandatesResponse.mandates
        }
      },
      setApiKey () {
        this.apiKey = this.apiKeyToTest
        this.getCustomers()
        this.apiKeyToTest = null
      },
      async selectFilePlease () {
        const result = await remote.dialog.showOpenDialog({
          properties: ['openFile'],
          title: 'Gime Money',
          filters: {name: 'fezfez', extensions: ['xls', 'csv']}
        })
        if (!result.filePaths.length) {
          return /* wip */
        }

        await Promise.all(result.filePaths.map(async file => {
          try {
            const p = fs.promises
            const res = await p.readFile(file, 'utf8')
            this.invoices = Papa.parse(res, {header: true}).data
          } catch (err) {
            alert('An error ocurred reading the file :' + err.message)
            return false
          }
        }))
      }
    }
  }
</script>

<style scoped>

    .items {
        margin-top: 8px;
    }

    .item {
        display: flex;
        margin-bottom: 6px;
    }

    .item .name {
        color: #6a6a6a;
        margin-right: 6px;
    }

    .item .value {
        color: #35495e;
        font-weight: bold;
    }
</style>

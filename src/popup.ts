import * as angular from 'angular';
import { config } from './config';
import { fetchDomainString, storage } from './libs';

module app {
    'use strict';

    interface IPopupScope extends angular.IScope {}

    class PopupController {
        static $inject = ['$scope'];
        private scope: IPopupScope;
        public domainList: string[];
        public yourDomain: string;

        constructor($scope: IPopupScope) {
            this.scope = $scope;
            this.init();
        }

        private init = () => {
            storage.sync
                .get(config.storage.nameOfDomainList)
                .then(data => {
                    this.domainList = data.domainList as string[];
                    this.scope.$apply();
                })
                .catch(error => {
                    console.log(error);
                    this.domainList = ['ERROR'];
                    this.scope.$apply();
                });
        };

        public add = () => {
            let domain = fetchDomainString(this.yourDomain);
            this.yourDomain = '';

            if (domain === '') return;
            if (this.domainList.includes(domain)) return;

            this.domainList.push(domain);
            storage.sync.set({ domainList: this.domainList });
        };

        public remove = (domain: string) => {
            this.domainList = [...this.domainList.filter(d => d !== domain)];
            storage.sync.set({ domainList: this.domainList });
        };

        public reset = () => {
            this.domainList = config.defaultDomainList;
            storage.sync.clear().then(() => {
                storage.sync.set({ domainList: config.defaultDomainList });
            });
        };

        public navigate = (domain: string) => {
            chrome.tabs.create({ active: true, url: `http://${domain}` }, tab => {
                console.log(tab);
            });
        };
    }

    angular.module('app', []).controller('popupController', PopupController);
}

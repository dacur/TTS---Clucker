class MainController < ApplicationController
	require 'cluckdata.rb'

	def index
  	end

  	def cluck
  		user_id = params[:user]
  		@user = User.find(user_id)
  		@clucks = CluckData.get_all

  	end
end
